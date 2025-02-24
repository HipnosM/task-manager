import prisma from "../config/prismaCLI.js";

// Pegar tarefas
const getTasks = async (req, res) => {
    const user = req.user;

    try {
        const tasks = await prisma.task.findMany({
            where: {
                userid: user.userId
            }
        });
        if (tasks.length === 0) return res.status(404).json({ message: "Não foi encontrada nenhuma tarefa." });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ error: "Erro ao buscar tarefas." });
    };
};

// Criar tarefa
const createTask = async (req, res) => {
    const user = req.user;
    const { title, description } = req.body;

    if (!title || !description) return res.status(400).json({ error: "Todos os campos são obrigatórios." });

    try {
        const newTask = await prisma.task.create({
            data: {
                taskname: title,
                taskdescription: description,
                userid: user.userId
            }
        });

        res.status(201).json({message: "Tarefa criada com sucesso!", task: newTask});
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar tarefa." });
    };
};

export { getTasks, createTask };