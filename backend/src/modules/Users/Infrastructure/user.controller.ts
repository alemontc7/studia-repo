import { Request } from "express";
import { Response } from "express";
import { Router } from "express";
import { createUserService } from "../Application/createUser.service";
import { loginUserService } from "../Application/loginUser.service";
import { jwtService } from "../../Auth/jwtService";
import { findUserService } from "../Application/findUser.service";
import { forgotPasswordService } from "../Application/forgotPassword.service";
import { resetPasswordService } from "../Application/resetPassword.service";

export const userRouter = Router();


export default class UserController{

    async register(req: Request, res: Response): Promise<void>{
        try{
            const {email, name, password} =  req.body;
            const newUser = await createUserService({email, name, password});
            res.status(201).json(
                newUser
            );
        } catch(error:any){
            res.status(400).json({message: error.message || 'Error al crear usuario'});
        }
    }

    async login(req: Request, res: Response): Promise<void>{    
        try{
            const {email, password} = req.body;
            const data = await loginUserService({email, password});
            const token = await jwtService.generateToken({email: data.email});
            const sameSiteConditional = process.env.NODE_ENV === 'production' ? 'none' : 'strict';
            
            let cookieDomain = '';
            if (process.env.FRONTEND_URL) {
                const { hostname } = new URL(process.env.FRONTEND_URL);
                console.log("DEBUGGING HOSTNAME FOR COOKIES", hostname);
                const parts = hostname.split('.');
                if (parts.length >= 2) {
                    cookieDomain = '.' + parts.slice(-2).join('.');
                }
                console.log("THE COOKIE WILL BE SAVED WITH THE FOLLOWING DOMAIN", cookieDomain);
            }
            //commment to be pushed
            
            if(process.env.NODE_ENV === 'production'){
                res.cookie('token', token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: sameSiteConditional,
                  //domain: cookieDomain,
                  maxAge: 3600000,
                });
              } else {
                res.cookie('token', token, {
                  httpOnly: true,
                  secure: false,
                  sameSite: sameSiteConditional,
                  //domain: cookieDomain,
                  maxAge: 3600000,
                });
              } //a
            res.status(201).json({
                name: data.name,
                email: data.email,
            });
        }
        catch(error:any){
            res.status(400).json({message: error.message || 'Error al hacer login'});
        }
    }

    async verify(req: Request, res: Response): Promise<void>{
        console.log("I was given this token to be analized ...", req.cookies.token);
        try{
            const token = req.cookies.token;
            if(!token){
                res.status(401).json({message: 'No token provided'});
                return;
            }
            const decoded = await jwtService.verifyToken(token);
            if(decoded.exp * 1000 < Date.now()){
                console.log("Token is expired");
                res.status(403).json({message: 'Expired token'});
                return;
            }
            console.log("Decoded token ...", decoded);
            const timeLeftMs = (decoded.exp * 1000 - Date.now())/60000;
            console.log("Time left in token:", timeLeftMs, "minutes");
            res.status(200).json({valid: true, email: decoded});
            console.log("This is the state that matters to the front", res.statusCode);
        } catch(error:any){
            res.status(403).json({message: error.message || 'Expired or Invalid token'});
        }
    }

    async findByEmail(req: Request, res: Response): Promise<void>{
        try{
            const {email} = req.params;
            const user = await findUserService(email);
            if(!user){
                res.status(404).json({message: 'User not found'});
                return;
            }
            console.log("User found", user);
            res.status(200).json(user);
        } catch(error:any){
            res.status(400).json({message: error.message || 'Error al buscar usuario'});
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        console.log("I am inside the forgot password controller");
        try {
          const { email } = req.body;
          if (!email) {
            res.status(400).json({ message: 'El correo es requerido.' });
            return;
          }
          const result = await forgotPasswordService(email);
          res.status(200).json(result);
        } catch (error: any) {
          res.status(500).json({ message: error.message || 'Error al enviar el enlace de recuperación.' });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
          const { email, token, newPassword } = req.body;
          if (!email || !token || !newPassword) {
            res.status(400).json({ message: 'El correo, el token y la nueva contraseña son requeridos.' });
            return;
          }
          const result = await resetPasswordService(email, token, newPassword);
          res.status(200).json(result);
        } catch (error: any) {
          res.status(500).json({ message: error.message || 'Error al restablecer la contraseña.' });
        }
    }
      
}
