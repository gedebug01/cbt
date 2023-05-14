const apiPath = require('../../constant/apiPath');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/Controller');

const adminRouter = require('./adminRouter');
const teacherRouter = require('./teacherRouter');
const studentRouter = require('./studentRouter');
const tokenRouter = require('./tokenRouter');

const { authentification } = require('../middlewares/auth');

router.post(apiPath.login, Controller.login);
router.post(apiPath.getAuth, Controller.getDataByAuth);

router.use(authentification);

router.use('/admin', adminRouter);
router.use('/teacher', teacherRouter);
router.use('/student', studentRouter);
router.use('/token', tokenRouter);

module.exports = router;
