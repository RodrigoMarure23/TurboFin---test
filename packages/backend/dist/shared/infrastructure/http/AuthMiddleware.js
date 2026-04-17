import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Acceso denegado. Token no proporcionado." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, "secret_fallback_backend");
        console.log("decoded token: ", decoded);
        req.userId = decoded.userId;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};
