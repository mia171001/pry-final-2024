const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const config = require('../common/config/env.config');
const CheckoutController = require('./controllers/orders.controller');
const FREE = config.permissionLevels.NORMAL_USER;
const path= require('path');

exports.routesConfig= function(app){
   
    app.post('/create-order',[ 
        ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        CheckoutController.createCheckoutSession]);

    app.get('/success', async (req, res) => {
        const orderId= req.query.orderId;

        if(orderId){
            try {
                await CheckoutController.markOrderAsPaid(orderId);
            } catch (error) {
                console.log('Error updating order to paid:', error);
                
            }
        }

        res.sendFile(path.join(__dirname, '../public/success.html'));
    });

    app.get('/my-orders',[
        ValidationMiddleware.validJWTNeeded,
        CheckoutController.getUserOrders
    ]);

};
