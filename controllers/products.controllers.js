// productController.js
const db = require('../models/index');
const getPagination = require('../utils/pagination');

const createProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, description, price } = req.body;
    const newProduct = await db.Product.create({
      name,
      description,
      price,
      sellerId: user.id,
    });

    res.status(201).json({
      status: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const { count, rows: products } = await db.Product.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
      order: [['createdAt', 'DESC']],
    })

    if (products.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No products found',
      });
    }

    const pagination = getPagination(req, count, page, limit);

    res.status(200).json({
      status: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getAllProducts };
