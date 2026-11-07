import { Router } from "express";
import { getMenu, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router: Router = Router();

// Si pones "/", al combinarlo con app.use("/api/productos", productRoutes) 
// responderá exactamente a http://localhost:3000/api/productos
router.get("/", getMenu);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;