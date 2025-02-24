import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// registrar novo usuário
router.post("/register", userController.userRegister);

// Fazer login
router.post("/login", userController.userLogin);

export { router as authRoutes };