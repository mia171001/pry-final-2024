const {Order}= require('../models/order.model');
const Product = require('../../products/models/product.model');
const User = require('../../users/models/user.model');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 


exports.createCheckoutSession= async (req, res)=>{
  try {
    const {carItems}= req.body;
    const userId= req.jwt.userId;
console.log(req.body);
    const user= await User.findById(userId);
    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    let lineItems=[];
    let totalAmount = 0;

    for (let item of carItems){
      const product= await Product.findById(item.productId);
      if(!product){
        return res.status(404).json({message:`Product ${item.productId} not found`});
      }

      if(product.stock<item.quantity){
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      totalAmount+=product.precio*item.quantity;

      lineItems.push({
        price_data:{
          currency:'pen',
          product_data:{
            name:product.name,
            description:product.description,
          },
          unit_amount:product.precio*100,
        },
        quantity:item.quantity,
      });
    }

    const order = await Order.create({
      userId:userId,
      product:carItems,
      totalAmount:totalAmount
    });


    const session= await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:lineItems,
      mode:'payment',
      success_url: `https://pry-final-2024.onrender.com/success?orderId=${order._id}`, // Página de éxito
      cancel_url: 'https://pry-final-2024.onrender.com/cancel', // Página de cancelación
      customer_email:req.jwt.email
    });

   

    order.sessionId = session.id;
    await order.save();

    res.json({ id: session.id });



  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

exports.markOrderAsPaid= async(orderId)=>{
  try {
    const order = await Order.findById(orderId).populate('product.productId');

    if(!order){
      throw new Error('Order not found');
    }

    for(let item of order.product){
      const product= item.productId;

      if (!product) {
        throw new Error(`Product not found for ID: ${item.productId}`);
      }

      if(product.stock<item.quantity){
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      product.stock-=item.quantity;
      await product.save();
    }

    

    order.status='paid';
    await order.save();
    return order;

  } catch (error) {
    console.error('Error marking order as paid:', error);
        throw error;
  }
}

exports.getUserOrders= async (req,res)=>{
  try {
    const userId= req.jwt.userId;
    const orders = await Order.find({ userId: userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las compras', error });
    }
}

