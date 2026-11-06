import { pool } from '../config/db.js';

export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
}

export const getAllClientesModel = async () => {
  const result = await pool.query('SELECT * FROM cliente ORDER BY id ASC');
  return result.rows;
};

export const getClienteByIdModel = async (id: number) => {
  const result = await pool.query('SELECT * FROM cliente WHERE id = $1', [id]);
  return result.rows[0];
};

export const createClienteModel = async (cliente: Cliente) => {
  const { nombre, email, telefono } = cliente;
  const query = `
    INSERT INTO cliente (nombre, email, telefono) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const result = await pool.query(query, [nombre, email, telefono]);
  return result.rows[0];
};

export const updateClienteModel = async (id: number, cliente: Partial<Cliente>) => {
  const { nombre, email, telefono } = cliente;
  const query = `
    UPDATE cliente 
    SET nombre = COALESCE($1, nombre), 
        email = COALESCE($2, email), 
        telefono = COALESCE($3, telefono) 
    WHERE id = $4 
    RETURNING *;
  `;
  const result = await pool.query(query, [nombre, email, telefono, id]);
  return result.rows[0];
};