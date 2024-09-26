const mongoose= require('../../common/services/mongoose.service').mongoose;
const Schema= mongoose.Schema;

const orderSchema= new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required: true,
    },
    product:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Products",
                required: true,
            },
            quantity:{
                type:Number,
                required: true,
            },
        },
    ],
    totalAmount:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentId: {
        type: String, // Stripe Payment ID
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

orderSchema.set('toJSON',{
    virtuals: true,
});

const Order= mongoose.model('Orders',orderSchema);

module.exports = {Order};