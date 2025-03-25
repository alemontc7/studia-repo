import express from 'express';
import UserController from '../modules/Users/Infrastructure/user.controller';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many login attempts, please try again in another moment'
});

const userControllerInstance = new UserController();

const router = express.Router();

router.post('/register', (req, res) => userControllerInstance.register(req,res));
router.post('/login', loginLimiter, (req, res) => userControllerInstance.login(req,res));
router.get('/verify', (req, res) => userControllerInstance.verify(req,res));
router.get('/alive', (req, res) => {res.status(200).send('I am alive');});  
export default router;