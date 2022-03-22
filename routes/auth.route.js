const authRouter = require('express').Router();
const { login, auth, register } = require('../controllers/auth.controller');
const { getOneUser } = require('../controllers/users.controller');
const authenticationMiddleware = require('../middleware/auth.middleware');

authRouter.post('/login', auth);
authRouter.get('/getuser', getOneUser);
authRouter.get('/login/:id', login);
authRouter.post('/register', register);

module.exports = authRouter;
