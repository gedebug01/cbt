if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const next = require('next');

const errorHandler = require('./middlewares/errorHandler');
const routers = require('./routes');

const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(cors());
    server.use(express.urlencoded({ extended: false }));
    server.use(express.json());

    server.post('/admin/addClass', (req, res, next) => {
      try {
        setTimeout(() => {
          res.status(200).json({ status: 'done' });
        }, 1000);
      } catch (error) {
        next(error);
      }
    });
    server.post('/admin/addStudent', (req, res, next) => {
      try {
        setTimeout(() => {
          res.status(200).json({ status: 'done' });
        }, 1000);
      } catch (error) {
        next(error);
      }
    });
    server.post('/admin/addTeacher', (req, res, next) => {
      try {
        setTimeout(() => {
          res.status(200).json({ status: 'done' });
        }, 1000);
      } catch (error) {
        next(error);
      }
    });
    server.post('/teacher/addQuestion', (req, res, next) => {
      try {
        setTimeout(() => {
          res.status(200).json({ status: 'done' });
        }, 1000);
      } catch (error) {
        next(error);
      }
    });

    server.use('/api', routers);

    server.use(errorHandler);

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, () => {
      console.log(`Go! ${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

module.exports = app;
