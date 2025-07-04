const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const productController = require('../controllers/productController');
const bwipjs = require('bwip-js');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');

// Set up API URL from environment or use default
const API_URL = process.env.API_URL || 'http://192.168.3.12:3000';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (increased for better UX)
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/generate - Generate test barcode without storing to DB
router.get('/generate', async (req, res) => {
  try {
    const { name = 'TEST' } = req.query;
    
    // Generate barcode using same logic as Product.create but without DB storage
    const baseName = name.replace(/\s+/g, '').toUpperCase();
    const timestamp = Date.now().toString().slice(-3); // Use timestamp for uniqueness
    const barcode = `${baseName}-${timestamp}`;
    
    // Generate barcode image
    bwipjs.toBuffer({
      bcid: 'code128',
      text: barcode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, png) => {
      if (err) return res.status(500).json({ error: 'Barcode generation failed' });
      
      res.type('image/png').send(png);
    });
  } catch (error) {
    console.error('Barcode generation error:', error);
    res.status(500).json({ error: 'Error generating test barcode' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProduct);

// POST /api/products - Create new product
router.post('/', productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete a product
router.delete('/:id', productController.deleteProduct);

// GET /api/products/:id/barcode - Get barcode image for product
router.get('/:id/barcode', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    bwipjs.toBuffer({
      bcid: 'code128',
      text: product.barcode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, png) => {
      if (err) return res.status(500).json({ error: 'Barcode generation failed' });
      res.type('image/png').send(png);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error generating barcode' });
  }
});

// GET /api/products/:id/barcode-print - Get print-ready barcode image with product info
router.get('/:id/barcode-print', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Generate a larger, print-ready barcode
    bwipjs.toBuffer({
      bcid: 'code128',
      text: product.barcode,
      scale: 4,
      height: 15,
      includetext: true,
      textxalign: 'center',
      textsize: 12,
      padding: 10,
    }, (err, png) => {
      if (err) return res.status(500).json({ error: 'Barcode generation failed' });
      res.type('image/png').send(png);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error generating print-ready barcode' });
  }
});

// GET /api/products/:id/barcode-pdf - Get barcode as PDF for product
router.get('/:id/barcode-pdf', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Generate barcode image buffer
    bwipjs.toBuffer({
      bcid: 'code128',
      text: product.barcode,
      scale: 6,
      height: 20,
      includetext: true,
      textxalign: 'center',
      textsize: 14,
      padding: 5,
    }, (err, png) => {
      if (err) return res.status(500).json({ error: 'Barcode generation failed' });
      
      // Create PDF with standard label dimensions (1.5" x 1" = 108pt x 72pt)
      const doc = new PDFDocument({ 
        size: [108, 72], // Standard label size in points
        margin: 5,
        autoFirstPage: true
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="barcode_${product.barcode}.pdf"`);
      
      // Embed barcode image to fill most of the PDF
      doc.image(png, { 
        fit: [98, 62], // Leave 5pt margin on all sides
        align: 'center', 
        valign: 'center' 
      });
      
      doc.end();
      doc.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error generating barcode PDF' });
  }
});

// POST /api/products/upload-image - Upload product image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const originalSize = req.file.size;

    // Compress the image using Sharp
    const compressedFilename = `compressed-${req.file.filename}`;
    const compressedPath = path.join(__dirname, '../uploads', compressedFilename);
    
    await sharp(req.file.path)
      .resize(800, 800, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: 70, // Good balance between quality and size
        progressive: true 
      })
      .toFile(compressedPath);

    // Get compressed file size
    const compressedStats = fs.statSync(compressedPath);
    const compressedSize = compressedStats.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    // Delete original file and rename compressed file
    fs.unlinkSync(req.file.path);
    fs.renameSync(compressedPath, req.file.path);

    // Return the file path that can be accessed via the static route
    const imageUrl = `${API_URL}/uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalSize: originalSize,
      compressedSize: compressedSize,
      compressionRatio: compressionRatio
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// PUT /api/products/:id/image - Update product image
router.put('/:id/image', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get the current product to check if it has an existing image
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const originalSize = req.file.size;
    console.log(`Original image size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

    // Compress the image using Sharp
    const compressedFilename = `compressed-${req.file.filename}`;
    const compressedPath = path.join(__dirname, '../uploads', compressedFilename);
    
    await sharp(req.file.path)
      .resize(800, 800, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: 70, // Good balance between quality and size
        progressive: true 
      })
      .toFile(compressedPath);

    // Get compressed file size
    const compressedStats = fs.statSync(compressedPath);
    const compressedSize = compressedStats.size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`Compressed image size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB (${compressionRatio}% reduction)`);

    // Delete original file and rename compressed file
    fs.unlinkSync(req.file.path);
    fs.renameSync(compressedPath, req.file.path);

    // Delete old image if it exists
    if (currentProduct.image_url) {
      const oldFilename = currentProduct.image_url.split('/').pop();
      const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update product with new image URL
    const imageUrl = `${API_URL}/uploads/${req.file.filename}`;
    const updatedProduct = await Product.updateImage(id, imageUrl);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Image update error:', error);
    
    // Clean up any partial files
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Error processing image. Please try with a smaller image or different format.' 
    });
  }
});

// DELETE /api/products/delete-image/:filename - Delete product image
router.delete('/delete-image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ error: 'Error deleting image' });
  }
});

module.exports = router; 