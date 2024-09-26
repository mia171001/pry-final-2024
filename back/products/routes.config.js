const ProductsController=require('./controllers/products.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig= function(app){
    app.post('/products',[
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProductsController.insert
    ]);

    app.get('/products',[
        ProductsController.list
    ]);

    app.get('/products/:productId',[
        ProductsController.getById
    ]);

    app.patch('/products/:productId',[
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProductsController.patchById
    ]);

    app.delete('/products/:productId',[
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProductsController.removeById
    ]);


}