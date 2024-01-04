const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const db = require("../models/index");

const guardSeller = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
            error: "missing token",
        });
    }

    if (authorization.split(" ")[0] !== "Bearer") {
        return res.status(400).send({
            auth: false,
            message: "Bad Request",
            errors: "invalid token",
        });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
                error: err.message,
            });
        }

        if (decoded.role !== "seller") {
            return res.status(503).json({
                status: false,
                message: "Forbidden Resource",
                error: "You are not authorized to access this resource",
            });
        }

        req.user = await db.User.findOne({
            where: { id: decoded.id }
        })
        next();
    });
};

const authorizationHeader = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
            error: "missing token",
        });
    }
    if (!authorization.startsWith("Bearer ")) {
        return res.status(400).json({
            auth: false,
            message: "Bad Request",
            errors: "invalid token",
        });
    }
    const token = authorization.substring(7);
    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        req.user = await db.User.findOne({
            where: { id: decoded.id }
        });
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                status: false,
                message: "Unauthorized",
                error: "token expired",
            });
        }
        return res.status(401).json({
            status: false,
            message: "Unauthorized",
            error: err.message,
        });
    }
};

module.exports = { authorizationHeader, guardSeller };