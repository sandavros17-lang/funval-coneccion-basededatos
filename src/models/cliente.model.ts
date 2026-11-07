import { pool } from "../config/db.js";

export class ClienteModel {
  static async findAll(limit: number, offset: number, filters: { nombre?: string }) {
    let query = `SELECT * FROM clientes WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.nombre) {
      query += ` AND nombre ILIKE $${paramIndex}`;
      params.push(`%${filters.nombre}%`);
      paramIndex++;
    }

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async count(filters: { nombre?: string }) {
    let query = `SELECT COUNT(*) FROM clientes WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.nombre) {
      query += ` AND nombre ILIKE $${paramIndex}`;
      params.push(`%${filters.nombre}%`);
      paramIndex++;
    }

    const { rows } = await pool.query(query, params);
    return parseInt(rows[0].count, 10);
  }
}