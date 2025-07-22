// backend/models/ProductGroupMembership.js
const db = require('../config/database');

class ProductGroupMembership {
  static async addProductToGroup(productId, groupId) {
    await db.execute(`
      INSERT IGNORE INTO product_group_membership (product_id, product_group_id)
      VALUES (?, ?)
    `, [productId, groupId]);

    // Optional: update count
    await db.execute(`
      UPDATE product_group SET count = count + 1 WHERE id = ?
    `, [groupId]);
  }

  static async removeProductFromGroup(productId, groupId) {
    await db.execute(`
      DELETE FROM product_group_membership
      WHERE product_id = ? AND product_group_id = ?
    `, [productId, groupId]);

    // Optional: decrement count
    await db.execute(`
      UPDATE product_group SET count = GREATEST(count - 1, 0) WHERE id = ?
    `, [groupId]);
  }

  static async removeAllGroupsForProduct(productId) {
    await db.execute(`
      DELETE FROM product_group_membership WHERE product_id = ?
    `, [productId]);
  }

  static async deleteByGroupId(groupId) {
    await db.execute(`
      DELETE FROM product_group_membership WHERE product_group_id = ?
    `, [groupId]);
  }

  static async getProductsByGroupId(groupId) {
    const [rows] = await db.execute(`
      SELECT p.*
      FROM products p
      JOIN product_group_membership pgm ON p.id = pgm.product_id
      WHERE pgm.product_group_id = ?
    `, [groupId]);
    return rows;
  }

  static async getGroupsForProduct(productId) {
    const [rows] = await db.execute(`
      SELECT pg.*
      FROM product_group pg
      JOIN product_group_membership pgm ON pg.id = pgm.product_group_id
      WHERE pgm.product_id = ?
    `, [productId]);
    return rows;
  }

  static async addMultipleProductsToGroup(groupId, productIds) {
    if (!Array.isArray(productIds) || productIds.length === 0) return;

    const values = productIds.map(productId => [productId, groupId]);
    await db.query(`
      INSERT IGNORE INTO product_group_membership (product_id, product_group_id)
      VALUES ?;
    `, [values]);
  }
}


module.exports = ProductGroupMembership;