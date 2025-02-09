import { useEffect, useState } from "react";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem("token"); // Pegamos o token JWT armazenado

            if (!token) {
                console.error("Usuário não autenticado. Faça login novamente.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/tasks", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Envia o token JWT no cabeçalho
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

        fetchTasks();
    }, []);

    return (
        <section>
            <h1>Tarefas</h1>
            {loading && <p>Carregando...</p>}
            {!loading && tasks.length === 0 && <p>Nenhuma tarefa encontrada.</p>}
            {!loading && tasks.length > 0 && (
                tasks.map((task) => (
                    <div key={task.id}>
                        <h3>{task.taskname}</h3> {/* Corrigido nome do campo */}
                        <p>{task.taskdescription}</p>
                        <span>Status: {task.taskstatus ? "Concluído" : "Pendente"}</span>
                    </div>
                ))
            )}
        </section>
    );
}
