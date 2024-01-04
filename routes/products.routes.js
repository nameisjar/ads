const { Router } = require('express');
const { createProduct, getAllProducts } = require('../controllers/products.controllers');
const { guardSeller } = require('../middlewares/auth.middlewares');
const { imageUpload } = require('../libs/multer');

const product = Router();
product.post('/', guardSeller, imageUpload.single('image'), createProduct);
product.get('/', getAllProducts);

module.exports = product