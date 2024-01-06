// orderController.js
const db = require('../models/index');
const getPagination = require('../utils/pagination');

const createOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { orderItems } = req.body;

    // Validasi orderItems
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'OrderItems should be a non-empty array',
      });
    }

    // Iterasi untuk memproses setiap orderItem
    const processedOrderItems = [];
    let totalAmount = 0;

    for (const item of orderItems) {
      const { productId, quantity } = item;

      // Validasi quantity
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: 'Quantity should be greater than 0',
        });
      }

      const product = await db.Product.findByPk(productId);

      // Validasi product
      if (!product) {
        return res.status(404).json({
          status: false,
          message: 'Not Found',
          error: `Product with ID ${productId} not found`,
        });
      }

      // Validasi stok
      if (product.stock < quantity) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          error: `Not enough stock available for the requested quantity of product with ID ${productId}`,
        });
      }

      // Hitung totalAmount untuk setiap orderItem
      totalAmount += product.price * quantity;

      // Tambahkan orderItem ke dalam array processedOrderItems
      processedOrderItems.push({
        productId,
        quantity,
      });
    }

    // Buat order
    const newOrder = await db.Order.create({
      customerId: user.id,
      totalAmount,
    });

    // Buat orderItems
    const createdOrderItems = await db.OrderItem.bulkCreate(processedOrderItems);

    // Associate orderItems with the order
    await newOrder.setOrderItems(createdOrderItems);

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
    let { page = 1, limit = 10 } = req.query;
    limit = Number(limit);
    page = Number(page);

    const sellerOrders = await db.Order.findAndCountAll({
      include: [
        {
          model: db.OrderItem,  
          include: [
            {
              model: db.Product,
              attributes: ['image', 'name', 'price'],
              where: { sellerId: user.id },
            },
          ],
        }
      ],
      offset: (page - 1) * limit,
      limit,
    });

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
