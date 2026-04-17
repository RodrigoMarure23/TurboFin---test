import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
  username?: string; // Agregado para almacenar el nombre de usuario, si es necesario
  
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret_fallback_backend") as {
      userId: string;
      email: string;
      role: string;
    };

    console.log("decoded token: ", decoded);
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
