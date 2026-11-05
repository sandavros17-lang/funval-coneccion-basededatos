import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/product.controller.js";

import { validateSchema } from "../middlewares/validateSchema.js";
import { 
  createProductSchema, 
  updateProductSchema 
} from "../schemas/product.schema.js";

const router: Router = Router();

router.get("/menu", getMenu);
router.get("/menu/:id", getProduct);
router.post("/menu", validateSchema(createProductSchema), createProduct);
router.put("/menu/:id", validateSchema(updateProductSchema), updateProduct);

router.post("/menu", createProduct);
router.put("/menu/:id", updateProduct);

export default router;