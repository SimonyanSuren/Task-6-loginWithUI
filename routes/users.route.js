const usersRouter = require('express').Router();

const {
  addUsers,
  getUsers,
  removeUsers,
  addOneUser,
  getOneUser,
  putOneUser,
  removeOneUser,
} = require('../controllers/users.controller');
const authenticationMiddleware = require('../middleware/auth.middleware');

usersRouter.route('/users',authenticationMiddleware).post(addUsers).get(getUsers).delete(removeUsers);
usersRouter.route('/user').post(addOneUser).put(putOneUser);
usersRouter.get('/user/:id',authenticationMiddleware, getOneUser);
usersRouter.delete('/user/:id', authenticationMiddleware,removeOneUser);

module.exports = usersRouter;
