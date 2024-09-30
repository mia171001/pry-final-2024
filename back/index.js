const cors = require("cors");
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8000;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const AuthorizationRouter = require('./authorization/routes.config');
AuthorizationRouter.routesConfig(app);
const UsersRouter = require('./users/routes.config');
const ProductsRouter = require('./products/routes.config');
const OrdersRouter= require('./orders/routes.config');
UsersRouter.routesConfig(app);
ProductsRouter.routesConfig(app);
OrdersRouter.routesConfig(app);

app.listen(PORT, function () {
    console.log('app listening at port %s', PORT);
});