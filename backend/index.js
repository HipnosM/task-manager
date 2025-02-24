import express from "express";
import { authRoutes } from "./routes/userRoute.js";
import cors from "cors";


const app = express();
const port = 3000;
app.use(cors()); // Permite requisições do frontend

app.use(express.json());

// app.get("/tasks", authenticateToken, async (req, res) => {
//   const { data: tasks, error } = await supabase
//     .from("tasks")
//     .select("*")
//     .eq("userid", req.user.userId);
//   if(!tasks) return res.status(400).json({ message: "Não foi encontrada nenhuma tarefa."})
//   if (error) return res.status(400).json({ error: "Erro ao buscar tarefas." });

//   res.json(tasks);
// });

// // criar tarefa
// app.post("/tasks/new-task", authenticateToken, async (req, res) => {
//   const { title, description } = req.body;
//   if (!title || !description) return res.status(400).json({ error: "Todos os campos são obrigatórios." });

//   const { data, error } = await supabase
//     .from("tasks")
//     .insert([{ taskname: title, taskdescription: description, userid: req.user.userId }]);
//   if (error) return res.status(400).json({ error: "Erro ao criar tarefa." });

//   res.status(201).json(data);
// });

// // atualizar tarefa
// app.put("/tasks/:id", authenticateToken, async (req, res) => {
//   const taskId = parseInt(req.params.id);
//   const { title, description, status } = req.body;

//   const { data, error } = await supabase
//     .from("tasks")
//     .update({ taskname: title, taskdescription: description, taskstatus: status })
//     .eq("id", taskId)
//     .eq("userid", req.user.userId)
//     .single();

//   if (error) return res.status(400).json({ error: "Erro ao atualizar tarefa." });
//   res.json({ message: "Tarefa atualizada com sucesso.", task: data });
// });

// // deletar tarefa
// app.delete("/tasks/:id", authenticateToken, async (req, res) => {
//   const taskId = parseInt(req.params.id);

//   const {data: task, error: findError} = await supabase
//     .from("tasks")
//     .select("userid")
//     .eq("id", taskId)
//     .single();
//   if(findError || task.userid !== req.user.userId) return res.status(403).json({ error: "Você não tem permissão para executar essa ação."});

//   // remover a tarefa
//   const {error} = await supabase
//     .from("tasks")
//     .delete()
//     .eq("id", taskId)
//     .eq("userid", req.user.userId);
  
//   if(error) return res.status(500).json({error: "Ocorreu um erro ao tentar remover a tarefa."});

//   res.json({message: "Tarefa excluída com sucesso."});
// })

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});