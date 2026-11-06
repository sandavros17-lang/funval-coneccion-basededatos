import { Router } from 'express';
import { 
  getClientes, 
  getClienteById, 
  createCliente, 
  updateCliente 
} from '../controllers/cliente.controller.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { clienteSchema, updateClienteSchema } from '../schemas/cliente.schema.js';

const router: Router = Router();

router.get('/customers', getClientes);
router.get('/customers/:id', getClienteById);
router.post('/customers', validateSchema(clienteSchema), createCliente);
router.put('/customers/:id', validateSchema(updateClienteSchema), updateCliente);

export default router;