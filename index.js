const express = require('express');
const usersRouter = require('./routes/users.route');
const authRouter = require('./routes/auth.route');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler.middleware');
const path = require('path');
const bodyParser = require('body-parser');

const client = require('./db/connect');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {
    pageTitle: 'Login',
    msg: false,
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    pageTitle: 'Register',
    notMatch: false,
    msg: false,
  });
});

app.use(authRouter);
app.use(usersRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;

client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

process.on('exit', () => {
  client.end();
});
