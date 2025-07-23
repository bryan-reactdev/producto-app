// backend/routes/productGroupRoutes.js
const express = require('express');
const router = express.Router();
const productGroupController = require('../controllers/productGroupController');

router.get('/', productGroupController.getAllProductGroups);
router.get('/:id', productGroupController.getGroupByIdWithProducts);
router.post('/', productGroupController.createProductGroup);
router.patch('/:id', productGroupController.updateProductGroup);
router.delete('/:id', productGroupController.deleteProductGroup);

module.exports = router;
