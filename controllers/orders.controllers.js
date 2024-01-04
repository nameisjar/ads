// orderController.js
const db = require('../models/index');
const getPagination = require('../utils/pagination');

const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { productId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Quantity should be greater than 0'
      });
    }

    const product = await db.Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
        error: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Not enough stock available for the requested quantity',
      });
    }

    const totalAmount = product.price * quantity;

    const newOrder = await db.Order.create({
      productId,
      customerId: user.id,
      quantity,
      totalAmount,
    });

    await product.update({ stock: product.stock - quantity });

    res.status(201).json({
      status: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const user = req.user;
    let { search, page = 1, limit = 10 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const searchWhere = {
      [db.Sequelize.Op.or]: [
        { code: { [db.Sequelize.Op.like]: `%${search}%` } },
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { description: { [db.Sequelize.Op.like]: `%${search}%` } },
      ],
    };

    const sellerOrders = await db.Order.findAndCountAll({
      where: search ? searchWhere : null,
      include: [
        {
          model: db.Product,
          where: { sellerId: user.id },
        },
        { model: db.User },
      ],
      offset: (page - 1) * limit,
      limit,
    })

    if (sellerOrders.count === 0) {
      return res.status(404).json({
        status: false,
        message: 'No orders found',
      });
    }

    const pagination = getPagination(req, sellerOrders.count, page, limit);

    res.status(200).json({
      status: true,
      message: 'Orders retrieved successfully',
      data: { sellerOrders, pagination },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getSellerOrders };
