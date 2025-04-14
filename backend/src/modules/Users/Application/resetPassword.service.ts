import { userRepository } from "../Infrastructure/user.repository";

export const resetPasswordService = async (
  email: string,
  token: string,
  newPassword: string,
  Adapter: userRepository = new userRepository()
): Promise<{ message: string }> => {
  const user = await Adapter.findByEmail(email);
  if (!user || user.reset_token !== token) {
    throw new Error("Token inválido o usuario no encontrado.");
  }
  if (user.reset_token_expiration && user.reset_token_expiration.valueOf() < Math.floor(Date.now())) {
    throw new Error("El token ha expirado.");
  }

  await Adapter.updatePasswordByEmail(email, newPassword);
  return { message: "Contraseña actualizada con éxito." };
};
