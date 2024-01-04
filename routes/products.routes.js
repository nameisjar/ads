const { Router } = require('express');
const { createProduct, getAllProducts } = require('../controllers/products.controllers');
const { authorizationHeader, guardSeller } = require('../middlewares/auth.middlewares');

const product = Router();
product.post('/', guardSeller, createProduct);
product.get('/', getAllProducts);

module.exports = product