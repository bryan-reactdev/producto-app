// backend/controllers/productGroupController.js
const ProductGroup = require('../models/ProductGroup');
const Product = require('../models/Product');

exports.getAllProductGroups = async (req, res) => {
  try {
    const groups = await ProductGroup.findAll();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product groups' });
  }
};

exports.getProductsByGroupId = async (req, res) => {
  try {
    const groupId = req.params.id;
    const products = await Product.findByGroupId(groupId);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products for this group' });
  }
}; 

exports.createProductGroup = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required' });
    }
    const group = await ProductGroup.create({ name: name.trim() });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create group' });
  }
}; 

exports.updateProductGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required' });
    }
    const updatedGroup = await ProductGroup.update(groupId, { name: name.trim() });
    res.json(updatedGroup);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update group' });
  }
}; 

exports.deleteProductGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    // Delete all products in this group
    await Product.deleteByGroupId(groupId);
    // Delete the group
    await ProductGroup.delete(groupId);
    res.json({ message: 'Group and its products deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete group and its products' });
  }
}; 