import { resetPasswordApi } from "../infrastructure/authApi";

export async function resetPassword(token: string, email: string, newPassword: string): Promise<{message: string}>
{
    if(!token || !email || !newPassword){
        throw new Error('Token, email and new password are required');
    }
    const response = await resetPasswordApi(token, email, newPassword);
    return response;
}

