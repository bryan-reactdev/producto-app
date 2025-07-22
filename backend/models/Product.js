// backend/models/Product.js
const db = require('../config/database');
const ProductGroupMembership = require('./ProductGroupMembership');

class Product {
  static async create({ name, price, barcode, image_url }) {
    let finalBarcode = barcode;

    // If no barcode provided, generate one
    if (!barcode) {
      const baseName = name.replace(/\s+/g, '').toUpperCase();
      const [rows] = await db.execute(
        'SELECT barcode FROM products WHERE UPPER(REPLACE(name, " ", "")) = ? ORDER BY barcode DESC',
        [baseName]
      );
      let nextNum = 1;
      if (rows.length > 0) {
        const match = rows[0].barcode.match(/-(\d{3})$/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      finalBarcode = `${baseName}-${String(nextNum).padStart(3, '0')}`;
    }

    const [result] = await db.execute(
      'INSERT INTO products (name, price, barcode, image_url) VALUES (?, ?, ?, ?)',
      [name, price, finalBarcode, image_url || null]
    );

    return { id: result.insertId, name, price, barcode: finalBarcode, image_url };
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT * FROM products ORDER BY id DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT * FROM products WHERE id = ?
    `, [id]);
    return rows[0];
  }


  static async update(id, { name, price, image_url, group_ids }) {
    // Update the product fields
    await db.execute(
      'UPDATE products SET name = ?, price = ?, image_url = ? WHERE id = ?',
      [name, price, image_url || null, id]
    );
  
    // If group_ids provided, update memberships
    if (Array.isArray(group_ids)) {
      // Remove old memberships
      await ProductGroupMembership.removeAllGroupsForProduct(id);
  
      // Add new memberships
      for (const groupId of group_ids) {
        await ProductGroupMembership.addProductToGroup(id, groupId);
      }
    }
  
    // Return updated product
    return this.findById(id);
  }

  static async updateImage(id, image_url) {
    await db.execute(
      'UPDATE products SET image_url = ? WHERE id = ?',
      [image_url, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return { id };
  }

  static async findByBarcode(barcode) {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE barcode = ?',
      [barcode]
    );
    return rows;
  }
}

module.exports = Product;
