import { Router } from "express";
import { registerUser, loginUser } from '../controllers/user';
import { authenticateUser } from "../middlewares/authMiddleware";


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;