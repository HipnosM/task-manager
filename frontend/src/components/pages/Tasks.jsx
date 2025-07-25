import { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import Button from "../layout/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import Toast from "react-hot-toast";
import api from "../../api/api";
import ModalTask from "../layout/ModalTask";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            fetchTasks();
        }, 300);
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            Toast.error("Você precisa estar logado para ver suas tarefas.");
            return;
        }

        await api.getTasks()
            .then((response) => {
                setTasks(response);
                console.log("Tarefas carregadas:", response);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar tarefas:", error);
                setLoading(false);
                Toast.error(`${error.message || "Erro ao buscar tarefas"}`, { icon: "❌" });
            })
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

        await api.deleteTask(taskId)
            .then(() => {
                // setTasks(tasks.filter(task => task.id !== taskId));
                fetchTasks();
                Toast.success("Tarefa excluída com sucesso!", { icon: "✅" });
            })
            .catch((error) => {
                console.error("Erro ao excluir tarefa:", error);
                Toast.error(`${error.message || "Erro ao excluir tarefa"}`, { icon: "❌" });
            })
    };

    return (
        <section id={styles.tasks_container}>
            <h2>Tarefas</h2>
            {loading && <div id={styles.loading}><FiLoader /></div>}
            {!loading && tasks.length === 0 &&
                <div id={styles.no_tasks}>
                    <p>Nenhuma tarefa encontrada.</p>
                    {!localStorage.getItem("token") && <p>Faça <a href="/">login</a> para ver suas tarefas.</p>}
                </div>}
            {!loading && tasks.length > 0 && (
                <div id={styles.tasks}>
                    {tasks
                        .sort((a, b) => {
                            const priorityOrder = { high: 1, medium: 2, low: 3 };
                            return priorityOrder[a.taskpriority.toLowerCase()] - priorityOrder[b.taskpriority.toLowerCase()];
                        })
                        .map((task) => <TaskCard key={task.id} task={task} onDelete={handleDelete} onEdit={handleEdit} />)
                    }
                </div>
            )}
            {modalOpen && <ModalTask
                modalOpen={modalOpen}
                task={selectedTask}
                mode="edit"
                onClose={() => setModalOpen(false)}
                onSave={handleEdit}
                fetchTasks={fetchTasks}
            />}
        </section>
    );
};

const TaskCard = ({ task, onDelete, onEdit }) => {
    return (
        <div className={styles.task}>
            <div className={styles.task__header}
                style={{ backgroundColor: priorityColors[task.taskpriority.toLowerCase()].backgroundColor }}>
                <span className={styles.task__priorityBadge}
                    style={{ backgroundColor: priorityColors[task.taskpriority.toLowerCase()].color }}>
                </span>
                <span className={styles.task__priority}>
                    {formatedPriority(task.taskpriority)}
                </span>
            </div>

            <div className={styles.task__content}>
                <h4 id={styles.task__name}>{task.taskname}</h4>
                <p id={styles.task__description}>{task.taskdescription}</p>
            </div>

            <div id={styles.task__actions}>
                <Button
                    text="Apagar"
                    customClass="thin red"
                    icon={<FaTrash />}
                    type="button"
                    onClick={() => onDelete(task.id)}
                />
                <Button
                    text="Editar"
                    customClass="thin"
                    icon={<FaEdit />}
                    onClick={() => onEdit(task)}
                />
            </div>
        </div>
    );
};

const priorityColors = {
    low: { color: "#28a745", backgroundColor: "#d4edda" },
    medium: { color: "#ffc107", backgroundColor: "#fff3cd" },
    high: { color: "#dc3545", backgroundColor: "#f8d7da" }
}

const formatedPriority = (priority) => {
    const priorityMap = {
        low: "Baixa prioridade",
        medium: "Média prioridade",
        high: "Alta prioridade"
    };
    return priorityMap[priority.toLowerCase()] || priority;
};
