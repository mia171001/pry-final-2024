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
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    sessionId: {
        type: String, // Stripe Session ID
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

orderSchema.findById = function(cb){
    return this.model('Orders').find({id: this.id}, cb);
}

const Order= mongoose.model('Orders',orderSchema);

module.exports = {Order};