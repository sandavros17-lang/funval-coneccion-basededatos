import type { Request, Response } from "express";
import { ProductModel } from "../models/product.model.js";
import type { ProductFilters } from "../models/product.model.js";
import { pool } from "../config/db.js";

export async function getMenu(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filters: ProductFilters = {};
    
    if (req.query.nombre) {
      filters.nombre = String(req.query.nombre);
    }
    
    if (req.query.maxPrice !== undefined && req.query.maxPrice !== "") {
      filters.maxPrice = Number(req.query.maxPrice);
    }

    const rows = await ProductModel.findAll(limit, offset, filters);
    const totalRegistros = await ProductModel.count(filters);
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
    res.status(500).json({ error: "Error al obtener los productos", detalles: error.message });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (idParam === undefined || idParam === "") {
      return res.status(400).json({ error: "ID inválido" });
    }

    const id = parseInt(idParam, 10);
    const query = `SELECT * FROM producto WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto", detalles: error.message });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { nombre, descripcion, precio } = req.body;
    
    const query = `
      INSERT INTO producto (nombre, descripcion, precio) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, descripcion, precio]);
    
    res.status(201).json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto", detalles: error.message });
  }
}
export async function updateProduct(req: Request, res: Response) {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (idParam === undefined || idParam === "") {
      return res.status(400).json({ error: "ID inválido" });
    }

    const id = parseInt(idParam, 10);
    const { nombre, descripcion, precio } = req.body;
    
    const query = `
      UPDATE producto
      SET nombre = COALESCE($1, nombre), 
          descripcion = COALESCE($2, descripcion), 
          precio = COALESCE($3, precio) 
      WHERE id = $4 
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, descripcion, precio, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado para actualizar" });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto", detalles: error.message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (idParam === undefined || idParam === "") {
      return res.status(400).json({ error: "ID inválido" });
    }

    const id = parseInt(idParam, 10);
    const query = `DELETE FROM producto WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }

    res.json({ mensaje: "Producto eliminado correctamente", producto: rows[0] });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto", detalles: error.message });
  }
}