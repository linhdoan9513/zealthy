import { Router } from 'express';
import {
  createUser,
  updateUser,
  getAllUsers,
  getUserById
} from '../controllers/userController';

const router = Router();

// User routes
router.post('/', createUser);
router.put('/:id', updateUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export default router; 