import express from 'express';
import UserController from '../modules/Users/Infrastructure/user.controller';
import rateLimit from 'express-rate-limit';
import { userRepository } from '../modules/Users/Infrastructure/user.repository';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many login attempts, please try again in another moment'
});

const userControllerInstance = new UserController();
const repo = new userRepository();

const router = express.Router();

router.post('/register', (req, res) => userControllerInstance.register(req,res));
router.post('/login', loginLimiter, (req, res) => userControllerInstance.login(req,res));
router.get('/verify', (req, res) => userControllerInstance.verify(req,res));
router.get('/alive', (req, res) => {res.status(200).send('Backend is running');});
router.get('/findByEmail/:email', (req, res) => userControllerInstance.findByEmail(req,res));
router.post('/forgot-password', (req, res) => userControllerInstance.forgotPassword(req, res));
export default router;