import express from "express";
import cors from "cors";
import prisma from "./config/prismaCLI.js";

import dotenv from "dotenv";
dotenv.config();

import { authRoutes } from "./routes/userRoute.js";
import { taskRoutes } from "./routes/taskRoute.js";
import authMiddleware from "./middlewares/authMiddleware.js";


const app = express();
app.use(cors()); // Permite requisições do frontend
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// manter database ativa a cada 5 dias
setInterval(async () => {
    console.log("Mantendo o banco de dados ativo...");
    const users = await prisma.user.findMany();
    console.log(`Usuários ativos: ${users.length}`);
}, 432000000); // 5 dias em milissegundos