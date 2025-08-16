import express from "express";
import cors from "cors";
import prisma from "./config/prismaCLI.js";

import dotenv from "dotenv";
dotenv.config();

import { authRoutes } from "./routes/userRoute.js";
import { taskRoutes } from "./routes/taskRoute.js";
import authMiddleware from "./middlewares/authMiddleware.js";


const app = express();

const allowedOrigins = [
  "https://task-manager-pgpm.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// garantir resposta para preflight
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

// manter database ativa a cada 5 dias
setInterval(async () => {
  console.log("Mantendo o banco de dados ativo...");
  const users = await prisma.user.findMany();
  console.log(`Usuários ativos: ${users.length}`);
}, 432000000); // 5 dias em milissegundos

export default app;