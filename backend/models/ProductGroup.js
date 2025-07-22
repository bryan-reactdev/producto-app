// backend/models/ProductGroup.js
const db = require('../config/database');
const ProductGroupMembership = require('./ProductGroupMembership');

class ProductGroup {
  static async create({ name }) {
    const [result] = await db.execute(
      'INSERT INTO product_group (name) VALUES (?)',
      [name]
    );
    return { id: result.insertId, name };
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM product_group ORDER BY id DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM product_group WHERE id = ?',
      [id]
    );
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

  static async findAllWithProducts() {
    // Fetch all groups first
    const groups = await this.findAll();

    // For each group, fetch products related to it
    const groupsWithProducts = await Promise.all(
      groups.map(async (group) => {
        const products = await ProductGroupMembership.getProductsByGroupId(group.id);
        return {
          ...group,
          products,
        };
      })
    );

    return groupsWithProducts;
  }

}

module.exports = ProductGroup;
