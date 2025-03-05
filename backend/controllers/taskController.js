import prisma from "../config/prismaCLI.js";

// Pegar tarefas
export const getTasks = async (req, res) => {
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
export const createTask = async (req, res) => {
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

export const updateTask = async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    const {title, description, status} = req.body;

    const task = await prisma.task.findFirst({
        where: {
            AND: [
                { id: parseInt(id) },
                { userid: user.userId }
            ]
        }
    });
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada." });

    try {
        const updatedTask = await prisma.task.update({
            where: {
                id: parseInt(id)
            },
            data: {
                taskname: title ? title : task.taskname,
                taskdescription: description ? description : task.taskdescription,
                taskstatus: status ? status === "true" : task.taskstatus
            }
        });

        res.status(200).json({ message: "Tarefa atualizada com sucesso!", task: updatedTask });
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar tarefa." });
        console.log(error);
    }
};

export const deleteTask = async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    const task = await prisma.task.findFirst({
        where: {
            AND: [
                { id: parseInt(id) },
                { userid: user.userId }
            ]
        }
    });
    if (!task) return res.status(404).json({ message: "Tarefa não encontrada." });

    try {
        await prisma.task.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({ message: "Tarefa deletada com sucesso!" });
    } catch (error) {
        res.status(400).json({ error: "Erro ao deletar tarefa." });
    }
};