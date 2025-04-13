import { userRepository } from "../Infrastructure/user.repository";
import crypto from "crypto";
import { sendResetEmail } from "../../../utils/emailService";

export const forgotPasswordService = async (email: string, Adapter: userRepository = new userRepository()): Promise<{message: string}> => {
    const user = await Adapter.findByEmail(email);
    if(!user){
        return {message: 'Si el correo existe se enviará un email para restablecer la contraseña'};
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expirationDate = Date.now() + 3600000;
    await Adapter.setResetToken(email, token, expirationDate);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendResetEmail(email, resetLink);
    return {message: 'Si el correo existe se enviará un email para restablecer la contraseña'};
}