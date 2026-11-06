import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El formato del correo electrónico es inválido'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
});

export const updateClienteSchema = clienteSchema.partial();