import express from "express";
import * as userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// registrar novo usuário
router.post("/register", userController.userRegister);

// Fazer login
router.post("/login", userController.userLogin);

// Usuário authenticado
router.get("/me", authMiddleware, userController.getAuthenticatedUser);

// Atualizar usuário
router.put("/me-update", authMiddleware, userController.updateUser);

export { router as authRoutes };