const db = require('../config/database');
const ProductGroup = require('./ProductGroup');

class Product {
  static async create(productData) {
    const { name, price, barcode, image_url, product_group_id } = productData;
    
    let finalBarcode = barcode;
    
    // If no barcode provided, generate one
    if (!barcode) {
      const baseName = name.replace(/\s+/g, '').toUpperCase();
      // Find max suffix for this name
      const [rows] = await db.execute(
        'SELECT barcode FROM products WHERE UPPER(REPLACE(name, " ", "")) = ? ORDER BY barcode DESC',
        [baseName]
      );
      let nextNum = 1;
      if (rows.length > 0) {
        // Extract last 3 digits from barcode
        const lastBarcode = rows[0].barcode;
        const match = lastBarcode.match(/-(\d{3})$/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }
      finalBarcode = `${baseName}-${String(nextNum).padStart(3, '0')}`;
    }
    
    const [result] = await db.execute(
      'INSERT INTO products (name, price, barcode, image_url, product_group_id) VALUES (?, ?, ?, ?, ?)',
      [name, price, finalBarcode, image_url || null, product_group_id || null]
    );
    // Increment group count if product_group_id is present
    if (product_group_id) {
      await ProductGroup.incrementCount(product_group_id);
    }
    return { id: result.insertId, name, price, barcode: finalBarcode, image_url, product_group_id };
  }

  // Helper to map SQL row to product object with group
  static mapRowToProduct(row) {
    return {
      id: row.id,
      name: row.name,
      price: row.price,
      barcode: row.barcode,
      created_at: row.created_at,
      updated_at: row.updated_at,
      image_url: row.image_url,
      product_group: row.product_group_id ? {
        id: row.product_group_id,
        name: row.product_group_name
      } : null
    };
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT p.*, pg.id AS product_group_id, pg.name AS product_group_name
      FROM products p
      LEFT JOIN product_group pg ON p.product_group_id = pg.id
      ORDER BY p.id DESC
    `);
    return rows.map(this.mapRowToProduct);
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT p.*, pg.id AS product_group_id, pg.name AS product_group_name
      FROM products p
      LEFT JOIN product_group pg ON p.product_group_id = pg.id
      WHERE p.id = ?
    `, [id]);
    const row = rows[0];
    if (!row) return undefined;
    return this.mapRowToProduct(row);
  }

  static async update(id, productData) {
    const { name, price, image_url, product_group_id } = productData;
    await db.execute(
      'UPDATE products SET name = ?, price = ?, image_url = ?, product_group_id = ? WHERE id = ?',
      [name, price, image_url || null, product_group_id || null, id]
    );
    const product = await this.findById(id);
    return product;
  }

  static async updateImage(id, image_url) {
    await db.execute(
      'UPDATE products SET image_url = ? WHERE id = ?',
      [image_url, id]
    );
    const product = await this.findById(id);
    return product;
  }

  static async delete(id) {
    // Fetch the product to get its group before deletion
    const product = await this.findById(id);
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    // Decrement group count if product_group_id exists
    if (product && product.product_group && product.product_group.id) {
      await ProductGroup.decrementCount(product.product_group.id);
    }
    return { id };
  }

  static async findByBarcode(barcode) {
    const [rows] = await db.execute(`
      SELECT p.*, pg.id AS product_group_id, pg.name AS product_group_name
      FROM products p
      LEFT JOIN product_group pg ON p.product_group_id = pg.id
      WHERE p.barcode = ?
    `, [barcode]);
    return rows.map(this.mapRowToProduct);
  }

  static async findByGroupId(groupId) {
    const [rows] = await db.execute(`
      SELECT p.*, pg.id AS product_group_id, pg.name AS product_group_name
      FROM products p
      LEFT JOIN product_group pg ON p.product_group_id = pg.id
      WHERE p.product_group_id = ?
      ORDER BY p.id DESC
    `, [groupId]);
    return rows.map(this.mapRowToProduct);
  }
}

module.exports = Product; 