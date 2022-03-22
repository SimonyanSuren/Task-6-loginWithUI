require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const model = require('../models/auth.model');

const auth = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('login', {
      pageTitle: 'Login',
      msg: 'Please provide email or password',
    });
  }
  if (!validator.isEmail(email)) {
    return res.render('login', {
      pageTitle: 'Login',
      msg: 'Please provide correct email or password',
    });
  }

  const user = await model.findUser(email);

  if (!user) {
    return res.render('login', {
      pageTitle: 'Login',
      msg: 'Please register',
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (checkPassword) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '30s',
    });
    res.setHeader('Authorization', 'Bearer ' + token);
    res.redirect(`/login/${user.id}`);
  } else {
    res.render('login', {
      pageTitle: 'Login',
      msg: 'Please insert correct email or password',
    });
  }
};

const login = async (req, res, next) => {
  res.render('getUsers', {
    pageTitle: 'Users',
    newUser: false,
    msg: '',
  });
};

const register = async (req, res, next) => {
  const user = req.body;

  if (!validator.isEmail(user.email)) {
    return res.render('register', {
      pageTitle: 'Register',
      notMatch: false,
      msg: 'Please provide correct email or password',
    });
  }
  if (user.password !== user.rePassword) {
    return res.render('register', {
      pageTitle: 'Register',
      notMatch: true,
      msg: "Passwords don't match",
    });
  }

  const ifUserExists = await model.findUser(user.email);

  if (ifUserExists) {
    res.status(409).render('register', {
      pageTitle: 'Register',
      notMatch: false,
      msg: 'User already exists',
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    bcrypt.genSalt(10, function (err, salt) {
      if (err) throw new Error();
      bcrypt.hash(user.password, salt, async (err, hash) => {
        if (err) {
          throw new Error();
        }
        user.password = hash;
        const result = await model.addUserToDB(user);
      });
    });
    res.status(201).render('welcome', {
      pageTitle: 'Welcome',
      notMatch: false,
      msg: '',
      newUser: user.name,
    });
  }
};

module.exports = { login, auth, register };
