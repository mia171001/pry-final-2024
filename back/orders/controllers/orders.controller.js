const {Order}= require('../models/order.model');
const Product = require('../../products/models/product.model');
const User = require('../../users/models/user.model');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Asegúrate de configurar tu clave secreta de Stripe

exports.createOrder = async (req, res) => {
  try {
    const { userId, cartItems, paymentMethodId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let totalAmount = 0;
    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        totalAmount += product.precio * item.quantity;
        return {
          productId: product._id,
          quantity: item.quantity,
        };
      })
    );

    // Crear el cargo en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe maneja centavos
      currency: 'pen',
      payment_method: paymentMethodId,
      confirm: true, // Confirmar el pago inmediatamente
    });

    // Crear la orden
    const order = new Order({
      userId: userId,
      products: products,
      totalAmount: totalAmount,
      paymentId: paymentIntent.id, // Guardar el ID del pago de Stripe
      status: 'paid',
    });

    await order.save();

    // Reducir el stock de los productos
    await Promise.all(
      cartItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      })
    );

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};