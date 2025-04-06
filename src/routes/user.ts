import { Router } from "express";
import { registerUser, loginUser, refreshToken } from '../controllers/user';
import { authenticateUser } from "../middlewares/authMiddleware";


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', authenticateUser, refreshToken);

export default router;