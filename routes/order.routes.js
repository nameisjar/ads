const { Router } = require('express');
const {createOrder, getSellerOrders} = require('../controllers/orders.controllers');
const { authorizationHeader, guardSeller } = require('../middlewares/auth.middlewares');

const order = Router();
order.post('/', authorizationHeader, createOrder);
order.get('/', guardSeller, getSellerOrders);


module.exports = order