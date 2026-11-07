import { pool } from "../config/db.js";

export interface ProductFilters {
  nombre?: string;
  maxPrice?: number;
}

export class ProductModel {
  static async findAll(limit: number, offset: number, filters?: ProductFilters) {
    let query = `SELECT * FROM producto WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.nombre) {
      query += ` AND nombre ILIKE $${paramIndex}`;
      params.push(`%${filters.nombre}%`);
      paramIndex++;
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND precio <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async count(filters?: ProductFilters) {
    let query = `SELECT COUNT(*) FROM producto WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.nombre) {
      query += ` AND nombre ILIKE $${paramIndex}`;
      params.push(`%${filters.nombre}%`);
      paramIndex++;
    }

    if (filters?.maxPrice !== undefined) {
      query += ` AND precio <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    const { rows } = await pool.query(query, params);
    return parseInt(rows[0].count, 10);
  }
}