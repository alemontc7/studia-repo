import { Request } from "express";
import { Response } from "express";
import { Router } from "express";
import { createUserService } from "../Application/createUser.service";
import { loginUserService } from "../Application/loginUser.service";
import { jwtService } from "../../Auth/jwtService";

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
            if(process.env.NODE_ENV === 'production'){
                res.cookie(
                    'token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: sameSiteConditional,
                        domain: '.railway.app',
                        maxAge: 3600000,
                    }
                );
                ///test push a
            } else{
                res.cookie(
                    'token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: sameSiteConditional,
                        maxAge: 3600000,
                    }
                );
            }
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
}
