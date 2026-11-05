import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validateSchema = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // Sobrescribimos req.body con los datos parseados y limpios por Zod
    req.body = result.data;
    next();
  };
};