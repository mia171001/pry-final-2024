const mongoose= require('../../common/services/mongoose.service').mongoose;
const Schema=mongoose.Schema;

const productSchema= new Schema({
    name:String,
    descripcion:String,
    precio: Number,
    stock:Number,
    imagenUrl:String,
    categoria:String,
    marca:String
});

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON',{
    virtuals:true
});

productSchema.findById= function (cb){
    return this.model('Products').find({id: this.id}, cb);
}

const Product = mongoose.model('Products',productSchema);


exports.findById=(id)=>{
    return Product.findById(id).
    then((result)=>{
        result=result.toJSON();
        delete result._id;
        delete result._v;
        return result;
    })
};

exports.createProduct=(productData)=>{
    const product = new Product(productData);
    return product.save();
};

exports.list=(perPage,page)=>{
    return new Promise((resolve, reject) => {
        Product.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, products) {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            })
    });
};

exports.patchProduct = (id, productData) => {
    return Product.findOneAndUpdate({
        _id: id
    }, productData);
};

exports.removeById=(productId)=>{
    return new Promise((resolve, reject) => {
        Product.deleteMany({_id: productId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.find = (filters) => {
    return Product.find(filters);
};