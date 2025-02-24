import express from "express";
import * as taskController from "../controllers/taskController.js";

const router = express.Router();

// Pegar tarefas
router.get("/", taskController.getTasks);

// Criar tarefa
router.post("/", taskController.createTask);

export {router as taskRoutes};