import { LoginCredentials, RegisterData, User } from "../domain/user";
import { loginApi, registerApi } from "../infrastructure/authApi";

export class AuthService{
    async login(credentials: LoginCredentials): Promise<User>{
        const response = await loginApi(credentials);
        return response;
    }

    async register(registerData: RegisterData): Promise<User>{
        const response = await registerApi(registerData);
        return response;
    }
}