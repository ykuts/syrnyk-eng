import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById,
  updateProduct,
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// Add new product
router.post('/add', createProduct);

// Get all products
router.get('/', getProducts);

// Get a product by ID
router.get('/:id', getProductById);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;