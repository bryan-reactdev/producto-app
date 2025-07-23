// backend/controllers/productGroupController.js
const ProductGroupMembership = require('../models/ProductGroupMembership');
const ProductGroup = require('../models/ProductGroup');
const Product = require('../models/Product');

exports.getAllProductGroups = async (req, res) => {
  try {
    const groupsWithProducts = await ProductGroup.findAllWithProducts();

    res.json(groupsWithProducts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product groups' });
    console.log(err)
  }
};

exports.getGroupByIdWithProducts = async (req, res) => {
  try {
    const groupId = req.params.id;

    const [groupRows] = await require('../config/database').execute(
      'SELECT * FROM product_group WHERE id = ?',
      [groupId]
    );

    if (groupRows.length === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const group = groupRows[0];
    const products = await ProductGroupMembership.getProductsByGroupId(groupId);

    group.products = products;

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch group data' });
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

    // Delete all group memberships
    await ProductGroupMembership.deleteByGroupId(groupId);

    // Delete the group itself
    await ProductGroup.delete(groupId);

    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete group' });
  }
}; 