import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"
});

const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
    // user
    login: async (credentials) => {
        try {
            const response = await instance.post("/auth/login", credentials);
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao fazer login.";
            console.error("Erro ao fazer login:", message);
            throw new Error(message);
        }
    },
    register: async (userData) => {
        try {
            const response = await instance.post("/auth/register", userData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao registrar usuário.";
            console.error("Erro ao registrar usuário:", message);
            throw new Error(message);
        }
    },
    logout: () => {
        localStorage.removeItem("token");
    },
    // tasks
    getTasks: async () => {
        try {
            const response = await instance.get("/tasks", { headers: authHeader() });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao buscar tarefas.";
            console.error("Erro ao buscar tarefas:", message);
            throw new Error(message);
        }
    },
    createTask: async (taskData) => {
        try {
            const response = await instance.post("/tasks", taskData, { headers: authHeader() });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao criar tarefa.";
            console.error("Erro ao criar tarefa:", message);
            throw new Error(message);
        }
    },
    updateTask: async (id, taskData) => {
        try {
            const response = await instance.put(`/tasks/${id}`, taskData, { headers: authHeader() });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao atualizar tarefa.";
            console.error("Erro ao atualizar tarefa:", message);
            throw new Error(message);
        }
    },
    deleteTask: async (id) => {
        try {
            const response = await instance.delete(`/tasks/${id}`, { headers: authHeader() });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || "Erro ao deletar tarefa.";
            console.error("Erro ao deletar tarefa:", message);
            throw new Error(message);
        }
    }
};

export default api;