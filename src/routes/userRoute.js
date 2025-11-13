import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authMiddleware, allowRoles } from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.put("/:userId", authMiddleware, allowRoles("admin"), userController.editUser);
userRouter.get("/:userId", authMiddleware, allowRoles("admin"),userController.getUserById);
userRouter.delete("/:userId", authMiddleware, allowRoles("admin"),userController.deleteUser);

export default userRouter;