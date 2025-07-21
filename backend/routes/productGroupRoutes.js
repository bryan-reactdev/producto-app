// backend/routes/productGroupRoutes.js
const express = require('express');
const router = express.Router();
const productGroupController = require('../controllers/productGroupController');

router.get('/', productGroupController.getAllProductGroups);
router.get('/:id', productGroupController.getProductsByGroupId);
router.post('/', productGroupController.createProductGroup);

module.exports = router;
