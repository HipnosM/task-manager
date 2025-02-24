import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { authRoutes } from "./routes/userRoute.js";
import { taskRoutes } from "./routes/taskRoute.js";
import authMiddleware from "./middlewares/authMiddleware.js";


const app = express();
app.use(cors()); // Permite requisições do frontend
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", authMiddleware, taskRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});