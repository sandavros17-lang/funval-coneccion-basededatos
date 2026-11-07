import type { Request, Response } from "express";
import { pool } from "../config/db.js";

export async function getClientes(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM cliente WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (req.query.nombre) {
      query += ` AND nombre ILIKE $${paramIndex}`;
      params.push(`%${req.query.nombre}%`);
      paramIndex++;
    }

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    
    const countQuery = `SELECT COUNT(*) FROM cliente WHERE 1=1`;
    const countResult = await pool.query(countQuery);
    const totalRegistros = parseInt(countResult.rows[0].count, 10);
    const totalPaginas = Math.ceil(totalRegistros / limit);

    res.json({
      page,
      limit,
      totalRegistros,
      totalPaginas,
      data: rows
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los clientes", detalles: error.message });
  }
}

export async function getClienteById(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    const id = parseInt(Array.isArray(idParam) ? idParam[0] ?? "" : idParam ?? "", 10);
    const query = `SELECT * FROM cliente WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el cliente", detalles: error.message });
  }
}

export async function createCliente(req: Request, res: Response) {
  try {
    const { nombre, email, telefono } = req.body;
    
    const query = `
      INSERT INTO cliente (nombre, email, telefono) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, email, telefono]);
    
    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente", detalles: error.message });
  }
}

export async function updateCliente(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    const id = parseInt(Array.isArray(idParam) ? idParam[0] ?? "" : idParam ?? "", 10);
    const { nombre, email, telefono } = req.body;
    
    const query = `
      UPDATE cliente 
      SET nombre = COALESCE($1, nombre), 
          email = COALESCE($2, email), 
          telefono = COALESCE($3, telefono) 
      WHERE id = $4 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, email, telefono, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado para actualizar" });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el cliente", detalles: error.message });
  }
}

export async function deleteCliente(req: Request, res: Response) {
  try {
    const idParam = req.params.id;
    const id = parseInt(Array.isArray(idParam) ? idParam[0] ?? "" : idParam ?? "", 10);
    const query = `DELETE FROM cliente WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado para eliminar" });
    }

    res.json({ mensaje: "Cliente eliminado correctamente", cliente: rows[0] });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el cliente", detalles: error.message });
  }
}