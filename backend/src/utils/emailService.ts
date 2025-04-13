import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Cuenta Gmail dedicada para el proyecto
    pass: process.env.EMAIL_PASS, // Contraseña de aplicación configurada en Gmail
  },
});

export async function sendResetEmail(email: string, resetLink: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Restablece tu contraseña",
    text: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`,
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  };

  await transporter.sendMail(mailOptions);
}