import type { Request, Response } from "express";
import * as productModel from "../models/product.model.js";

export const getMenu = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtener todos los productos del menú' */
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
  console.error("Error detallado:", error);
  res.status(500).json({ error: "Error interno del servidor al obtener el menú" });
}
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Obtener un producto por su ID' */
  try {
    const id = Number(req.params.id);
    const product = await productModel.getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Crear un nuevo producto' */
  try {
    const { nombre, descripcion, precio } = req.body;
    const newProduct = await productModel.insertProduct(nombre, descripcion, precio);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  /* #swagger.tags = ['Products']
     #swagger.summary = 'Actualizar un producto por su ID' */
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio } = req.body;
    const updated = await productModel.updateProduct(id, nombre, descripcion, precio);
    if (!updated) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};