// backend/models/ProductGroup.js
const db = require('../config/database');

class ProductGroup {
  static async create({ name }) {
    const [result] = await db.execute(
      'INSERT INTO product_group (name) VALUES (?)',
      [name]
    );
    return { id: result.insertId, name };
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM product_group ORDER BY id DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM product_group WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { name }) {
    await db.execute(
      'UPDATE product_group SET name = ? WHERE id = ?',
      [name, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM product_group WHERE id = ?', [id]);
    return { id };
  }

  static async incrementCount(id) {
    await db.execute(
      'UPDATE product_group SET count = count + 1 WHERE id = ?',
      [id]
    );
  }

  static async decrementCount(id) {
    await db.execute(
      'UPDATE product_group SET count = GREATEST(count - 1, 0) WHERE id = ?',
      [id]
    );
  }
}

module.exports = ProductGroup; 