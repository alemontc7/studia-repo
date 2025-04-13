export interface ResetPasswordDto {
    token: string;
    email: string;
    newPassword: string;
}