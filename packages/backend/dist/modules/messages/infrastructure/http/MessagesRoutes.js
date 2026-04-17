// modules/messages/infrastructure/http/MessageRoutes.ts
import { Router } from "express";
import { authMiddleware } from "../../../../shared/infrastructure/http/AuthMiddleware.js";
import { PostMessageController } from "./PostMessageController.js";
import { PostReplyController } from "./PostReplyController.js";
import { GetMessagesController } from "./GetMessageController.js";
import { GetMessageThreadController } from "./GetMessageThreadController.js";
import { PostLikeController } from "./PostLikeController.js";
import { GetRecentActivityController } from "./GetRecentActivityController.js"; // <-- NUEVO
const messageRouter = Router();
const postMessageController = new PostMessageController();
const postReplyController = new PostReplyController();
const getMessagesController = new GetMessagesController();
const postLikeController = new PostLikeController();
const getMessageThreadController = new GetMessageThreadController();
const getRecentActivityController = new GetRecentActivityController(); // <-- NUEVO
// --- RUTAS PÚBLICAS ---
messageRouter.get("/", (req, res) => getMessagesController.run(req, res));
messageRouter.get("/thread/:messageId", (req, res) => getMessageThreadController.run(req, res));
// --- RUTAS PROTEGIDAS ---
// Obtener actividad reciente del usuario (NUEVO)
messageRouter.get("/activity", authMiddleware, (req, res) => getRecentActivityController.run(req, res));
messageRouter.post("/", authMiddleware, (req, res) => postMessageController.run(req, res));
messageRouter.post("/reply", authMiddleware, (req, res) => postReplyController.run(req, res));
messageRouter.post("/:messageId/like", authMiddleware, (req, res) => postLikeController.run(req, res));
export { messageRouter };
