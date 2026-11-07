import type { Request, Response } from "express";
import { SaleModel } from "../models/sale.model.js";

export async function getSales(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const rows = await SaleModel.findAll(limit, offset);
    const totalRegistros = await SaleModel.count();
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
    res.status(500).json({ error: "Error al obtener los pedidos", detalles: error.message });
  }
}

export async function getSaleById(req: Request, res: Response) {
  try {
    const idParam = req.params.id;

    if (typeof idParam !== "string") {
      return res.status(400).json({ error: "ID de pedido inválido" });
    }

    const id = parseInt(idParam, 10);
    const sale = await SaleModel.findById(id);

    if (!sale) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json(sale);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el pedido", detalles: error.message });
  }
}

export async function createSale(req: Request, res: Response) {
  try {
    const newSale = await SaleModel.create(req.body);
    res.status(201).json(newSale);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el pedido", detalles: error.message });
  }
}