const Controllers = require('../controllers/Controller');
const apiPath = require('../../constant/apiPath');
const express = require('express');

const router = express.Router();

router.get(apiPath.api.token.list, Controllers.listToken);
router.get(apiPath.api.token.getOneToken, Controllers.getOneToken);
router.post(apiPath.api.token.create, Controllers.createToken);
router.delete(apiPath.api.token.delete, Controllers.deleteToken);

module.exports = router;
