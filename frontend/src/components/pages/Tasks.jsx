import { useEffect, useState } from "react";
import styles from "./Tasks.module.css";
import Button from "../layout/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Usuário não autenticado. Faça login.");
                setLoading(!loading);
                return;
            }

            try {
                const response = await fetch(`${url}/tasks`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar tarefas");
                }

                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        setTimeout(() => {
            fetchTasks();
        }, 300);
    }, []);

    const handleDelete = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            setLoading(true);
            const response = await fetch(`${url}/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao excluir tarefa");
            }
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section id={styles.tasks_container}>
            <h2>Tarefas</h2>
            {loading && <div id={styles.loading}><FiLoader /></div>}
            {!loading && tasks.length === 0 &&
                <div id={styles.no_tasks}>
                    <p>Nenhuma tarefa encontrada.</p>
                    <p>Faça <a href="/">login</a> para ver suas tarefas.</p>
                </div>}
            {!loading && tasks.length > 0 && (
                <div id={styles.tasks}>
                    {tasks.map((task) => (
                        <div key={task.id} className={styles.task}>
                            <h3 id={styles.task_title}>{task.taskname}</h3>
                            <p id={styles.task_description}>{task.taskdescription}</p>
                            <p id={styles.task_status}>Status: <span>{task.taskstatus ? "Concluído" : "Pendente"}</span></p>
                            <div id={styles.task_buttons}>
                                <Button
                                    text="Editar"
                                    customClass="thin"
                                    icon={<FaEdit />}
                                    onClick={() => handleEdit(task.id)}
                                />
                                <Button
                                    text="Apagar"
                                    customClass="thin transparent trash"
                                    icon={<FaTrash />}
                                    type="button"
                                    onClick={() => handleDelete(task.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
