require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const {
  validationCreateUser,
  validationLogin,
} = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const handelError = require('./middlewares/handelError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors);
app.use(bodyParser.json());

app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

try {
  mongoose.set('strictQuery', false)
  mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  console.log('Mongo connected')
}
catch(error) {
  console.log(error)
  process.exit()
}
app.post('/sign-in', validationLogin, login);
app.post('/sign-up', validationCreateUser, createUser);

app.use(auth);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(handelError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
