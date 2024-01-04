const { Router } = require('express');
const { register, getAllUsers, login, autenticate } = require('../controllers/users.controllers');
const { authorizationHeader ,guardSeller } = require('../middlewares/auth.middlewares');

const auth = Router();
auth.post('/register', register);
auth.post('/login', login);
auth.get('/users', getAllUsers);
auth.get('/authenticated', authorizationHeader, autenticate);

module.exports = auth