import express from "express";
import * as taskController from "../controllers/taskController.js";

const router = express.Router();

// Pegar tarefas
router.get("/", taskController.getTasks);

// Criar tarefa
router.post("/", taskController.createTask);

// Atualizar tarefa
router.put("/:id", taskController.updateTask);

// Deletar tarefa
router.delete("/:id", taskController.deleteTask);

export {router as taskRoutes};