import jwt from "jsonwebtoken";

export const jwtService = {
  generateToken: async (payload: object): Promise<string> => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "24h" });
  },
  verifyToken: (token: string): any => {
    console.log("Verifying token with jwt verify...", token);
    return jwt.verify(token, process.env.JWT_SECRET as string);
  },
};
