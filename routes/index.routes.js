const { Router } = require('express');
const auth = require('./users.routes');
const product = require('./products.routes');
const order = require('./order.routes');

const router = Router();
router.use('/auth', auth);
router.use('/products', product);
router.use('/order', order);

module.exports = router