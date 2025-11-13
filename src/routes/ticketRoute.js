import { Router } from "express";
import * as ticketController from "../controllers/ticketController.js";
import upload from "../utils/upload.js";
import { authMiddleware, allowRoles } from "../middlewares/authMiddleware.js";
const ticketRouter = Router();

ticketRouter.post("/", authMiddleware, allowRoles("user"), upload.single("attachments"), ticketController.createTicket);
ticketRouter.get("/:ticketId", authMiddleware, allowRoles("admin", "staff", "user"),ticketController.getTicketById);

export default ticketRouter;