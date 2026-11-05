import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio" })
    .min(1, "El nombre no puede estar vacío"),
  
  description: z
    .string({ message: "La descripción es obligatoria" })
    .min(1, "La descripción no puede estar vacía"),
  
  price: z
    .number({ message: "El precio es obligatorio" })
    .positive("El precio debe ser un número positivo (mayor a cero)"),
  
  cost: z
    .number()
    .min(0, "El costo no puede ser negativo")
    .optional(),
  
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;