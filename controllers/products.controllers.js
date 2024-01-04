// productController.js
const db = require('../models/index');
const getPagination = require('../utils/pagination');
const cloudinary = require('../libs/cloudinary');

const createProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const { code, name, description, price, stock } = req.body;

    const codeProduct = await db.Product.findOne({ where: { code } });

    if (codeProduct) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        error: 'Code product already exists',
      });
    }

    let image;  

    if (req.file && req.file.buffer) {
      const timestamp = new Date();
      const publicId = `products/${timestamp.getTime()}-${req.file.originalname}`;

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image", public_id: publicId }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
          ).end(req.file.buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        image = uploadResult.secure_url;
      } else {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: "Image upload failed",
        });
      }
    }

    const newProduct = await db.Product.create({
      image,
      code,
      name,
      description,
      price,
      sellerId: user.id,
      stock,
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

    const { count, rows: products } = await db.Product.findAndCountAll({
      where: search ? searchWhere : null,
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
