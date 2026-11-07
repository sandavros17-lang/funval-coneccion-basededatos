import { pool } from "../config/db.js";

export class SaleModel {
  static async findAll(limit: number, offset: number) {
    const query = `
      SELECT pedido.*, cliente.nombre AS customer_name 
      FROM pedido 
      INNER JOIN cliente ON pedido.id_cliente = cliente.id
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows;
  }

  static async count() {
    const { rows } = await pool.query(`SELECT COUNT(*) FROM pedido`);
    return parseInt(rows[0].count, 10);
  }

  static async findById(id: number) {
    const query = `
      SELECT pedido.*, cliente.nombre AS customer_name 
      FROM pedido 
      INNER JOIN cliente ON pedido.id_cliente = cliente.id
      WHERE pedido.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async create(data: { id_cliente: number; fecha?: string }) {
    const query = `
      INSERT INTO pedido (id_cliente, fecha) 
      VALUES ($1, COALESCE($2, CURRENT_DATE)) 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [data.id_cliente, data.fecha]);
    return rows[0];
  }
}