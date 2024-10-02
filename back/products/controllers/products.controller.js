const ProductModel= require('../models/product.model');

exports.insert=(req,res)=>{
    ProductModel.createProduct(req.body)
        .then((result)=>{
            res.status(201).send({id:result._id});
        })
        .catch(err => res.status(500).send({ message: err.message }));
}

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    ProductModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.listFilter = (req, res) => {
    const filters = {};
    if (req.query.categoria) {
        
        filters.categoria = req.query.categoria;

        console.log(req.query.categoria);
    }
    if (req.query.minPrice && req.query.maxPrice) {
        filters.precio = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    }
    if (req.query.name) {
        filters.name = { $regex: req.query.name, $options: 'i' }; // Búsqueda por nombre
    }
    ProductModel.find(filters)
        .then((products) => {
            res.status(200).send(products);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.getById = (req, res) => {
    ProductModel.findById(req.params.productId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById=(req, res) => {
    ProductModel.patchProduct(req.params.productId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    ProductModel.removeById(req.params.productId)
        .then((result)=>{
            res.status(204).send({});
        });
};
