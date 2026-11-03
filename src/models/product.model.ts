import pool from "../config/db";

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
}

// Retorna todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  const { rows } = await pool.query("SELECT * FROM products ORDER BY id ASC");
  return rows;
};

// Retorna un producto por ID o null si no existe
export const getProductById = async (id: number): Promise<Product | null> => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return rows.length ? rows[0] : null;
};

// Inserta un nuevo producto
export const insertProduct = async (
  name: string,
  description: string,
  price: number
): Promise<Product> => {
  const { rows } = await pool.query(
    "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
    [name, description, price]
  );
  return rows[0];
};

// Actualiza un producto existente por ID o retorna null si no existe
export const updateProduct = async (
  id: number,
  name: string,
  description: string,
  price: number
): Promise<Product | null> => {
  const { rows } = await pool.query(
    "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
    [name, description, price, id]
  );
  return rows.length ? rows[0] : null;
};