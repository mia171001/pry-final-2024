const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');
const CheckoutController = require('./controllers/orders.controller');
const PAID = config.permissionLevels.PAID_USER;


exports.routesConfig= function(app){
   
    app.post('/create-order',[ 
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        CheckoutController.createOrder]);
};
