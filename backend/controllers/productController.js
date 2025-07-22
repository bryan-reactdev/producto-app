const ProductGroupMembership = require('../models/ProductGroupMembership');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Helper function to handle database errors
const handleDatabaseError = (error, res, operation) => {
  console.error('Database error:', error);
  
  // Check if it's a database connection error
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || 
      error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_BAD_DB_ERROR' ||
      error.message.includes('connect') || error.message.includes('database')) {
    return res.status(503).json({ 
      error: 'Database connection failed',
      details: 'Unable to connect to the database. Please check your database configuration.'
    });
  }
  
  res.status(500).json({ error: `Error ${operation}` });
};

// Helper function to validate required fields
const validateRequiredFields = (req, res, fields) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  return true;
};

// Helper function to check if product exists
const checkProductExists = async (id, res) => {
  const product = await Product.findById(id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
};

const productController = {
  // Get all products or filter by barcode
  async getAllProducts(req, res) {
    try {
      const { barcode } = req.query;
      if (barcode) {
        const products = await Product.findByBarcode(barcode);
        return res.json(products);
      }
      
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      handleDatabaseError(error, res, 'fetching products');
    }
  },

  // Get single product
  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      handleDatabaseError(error, res, 'fetching product');
    }
  },

  // Create product
  async createProduct(req, res) {
    try {
      if (!validateRequiredFields(req, res, ['name', 'price'])) return;

      const { name, price, barcode, image_url, group_ids = [] } = req.body;

      const product = await Product.create({ name, price, barcode, image_url });

      // Associate with groups if any are provided
      for (const groupId of group_ids) {
        await ProductGroupMembership.addProductToGroup(product.id, groupId);
      }

      res.status(201).json(product);
    } catch (error) {
      handleDatabaseError(error, res, 'creating product');
    }
  },

  // Update product
 async updateProduct(req, res) {
  try {
    const { id } = req.params;

    if (!validateRequiredFields(req, res, ['name', 'price'])) return;

    const existingProduct = await checkProductExists(id, res);
    if (!existingProduct) return;

    const { name, price, group_ids } = req.body;

    const updatedProduct = await Product.update(id, { name, price });

    // Update group associations if group_ids provided
    if (Array.isArray(group_ids)) {
      // Clear old memberships
      await ProductGroupMembership.removeAllGroupsForProduct(id);

      // Add new memberships
      for (const groupId of group_ids) {
        await ProductGroupMembership.addProductToGroup(id, groupId);
      }
    }

    res.json(updatedProduct);
  } catch (error) {
    handleDatabaseError(error, res, 'updating product');
  }
},

  // Delete product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const existingProduct = await checkProductExists(id, res);
      if (!existingProduct) return;
      
      // Delete associated image file if it exists
      if (existingProduct.image_url) {
        const filename = existingProduct.image_url.split('/').pop();
        const filePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await Product.delete(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      handleDatabaseError(error, res, 'deleting product');
    }
  },

  async assignGroupToProducts (req, res){
    const { group_id, product_ids } = req.body;

    if (!group_id || !Array.isArray(product_ids)) {
      return res.status(400).json({ error: 'Invalid group_id or product_ids' });
    }
  
    try {
      await ProductGroupMembership.addMultipleProductsToGroup(group_id, product_ids);
  
      res.status(200).json({ message: 'Group assigned to products successfully' });
    } catch (error) {
      console.error('Error assigning group to products:', error);
      res.status(500).json({ error: 'Database error while assigning group' });
    }
  }
};

module.exports = productController; 