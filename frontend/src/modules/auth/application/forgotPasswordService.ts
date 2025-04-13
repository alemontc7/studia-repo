import { forgotPasswordApi } from "../infrastructure/authApi";

export async function forgotPassword(email: string): Promise<{message: string}> {
    if(!email){
        throw new Error('Email is required');
    }
    const response = await forgotPasswordApi(email);
    return response;
}
