const db = require('../config/database');

class Product {
  static async create(productData) {
    const { name, price, barcode, image_url } = productData;
    
    console.log('Product.create called with:', productData); // Debug log
    
    let finalBarcode = barcode;
    
    // If no barcode provided, generate one
    if (!barcode) {
      console.log('No barcode provided, generating one...'); // Debug log
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
      console.log('Generated barcode:', finalBarcode); // Debug log
    } else {
      console.log('Using provided barcode:', barcode); // Debug log
    }
    
    console.log('Final barcode to be stored:', finalBarcode); // Debug log
    
    const [result] = await db.execute(
      'INSERT INTO products (name, price, barcode, image_url) VALUES (?, ?, ?, ?)',
      [name, price, finalBarcode, image_url || null]
    );
    return { id: result.insertId, name, price, barcode: finalBarcode, image_url };
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM products ORDER BY id DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, productData) {
    const { name, price, image_url } = productData;
    await db.execute(
      'UPDATE products SET name = ?, price = ?, image_url = ? WHERE id = ?',
      [name, price, image_url || null, id]
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
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return { id };
  }

  static async findByBarcode(barcode) {
    const [rows] = await db.execute('SELECT * FROM products WHERE barcode = ?', [barcode]);
    return rows;
  }
}

module.exports = Product; 