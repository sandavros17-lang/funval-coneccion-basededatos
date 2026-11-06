import type { Request, Response } from 'express';
import { 
  getAllClientesModel, 
  getClienteByIdModel, 
  createClienteModel, 
  updateClienteModel 
} from '../models/cliente.model.js';

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await getAllClientesModel();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(Array.isArray(idParam) ? idParam[0] ?? '' : idParam ?? '', 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'ID de cliente inválido' });
    }
    const cliente = await getClienteByIdModel(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const nuevoCliente = await createClienteModel(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const id = parseInt(Array.isArray(idParam) ? idParam[0] ?? '' : idParam ?? '', 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'ID de cliente inválido' });
    }
    const clienteActualizado = await updateClienteModel(id, req.body);
    if (!clienteActualizado) {
      return res.status(404).json({ error: 'Cliente no encontrado para actualizar' });
    }
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};