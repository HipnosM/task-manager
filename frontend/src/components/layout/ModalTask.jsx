import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from './Button';
import Toast from 'react-hot-toast';
import api from '../../api/api';

export default function ModalTask({ modalOpen = false, onClose, mode = "create", task = null, fetchTasks }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(getInitialState(mode, task));

    useEffect(() => {
        if (modalOpen) {
            setFormData(getInitialState(mode, task));
            setIsSubmitting(false);
        }
    }, [modalOpen, mode, task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);

        const { title, description, priority, status } = formData;
        if (!title || !description || !priority) {
            Toast.error("Preencha todos os campos obrigatórios!");
            setIsSubmitting(false);
            return;
        }

        const taskData = { title, description, priority, status };

        if (mode === "create") {
            await api.createTask(taskData)
                .then(() => {
                    Toast.success("Tarefa criada com sucesso!", { icon: "✅" });
                })
                .catch((error) => {
                    Toast.error(error.message, { icon: "❌" });
                });
        }

        if (mode === "edit" && task) {
            await api.updateTask(task.id, taskData)
                .then(() => {
                    Toast.success("Tarefa atualizada com sucesso!", { icon: "✅" });
                    fetchTasks();
                })
                .catch((error) => {
                    Toast.error(error.message, { icon: "❌" });
                });
        }

        setIsSubmitting(false);
        onClose();
    }

    return (
        <Modal
            show={modalOpen} onHide={onClose}
            // data-bs-theme="dark"
            backdrop="static"
            centered
        >
            <Modal.Header
                closeButton
                closeLabel="Fechar"
                style={{ fontSize: ".88rem" }}
            >
                <Modal.Title
                    style={{ fontSize: "1.25rem" }}
                >{mode === "edit" ? "Editar tarefa" : "Criar Tarefa"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bootstrap-font">
                <Form className="bootstrap-font" onSubmit={handleSubmit}>
                    <Form.Group className="d-flex gap-3">
                        <Form.Group className="mb-3 w-100">
                            <Form.Label style={style.label}>Título</Form.Label>
                            <Form.Control
                                type="text" placeholder="Título"
                                id="taskname" style={style.input}
                                required value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 w-100">
                            <Form.Label style={style.label}>Prioridade</Form.Label>
                            <Form.Select
                                id="priority" style={style.input}
                                required value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="LOW">Baixa</option>
                                <option value="MEDIUM">Média</option>
                                <option value="HIGH">Alta</option>
                            </Form.Select>
                        </Form.Group>


                        <Form.Group>
                            <Form.Label style={style.label}>Status</Form.Label>
                            <Form.Select
                                id="status" style={style.input}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                disabled={isSubmitting}
                            >
                                <option value="false">Pendente</option>
                                <option value="true">Concluída</option>
                            </Form.Select>
                        </Form.Group>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={style.label}>Descrição</Form.Label>
                        <Form.Control
                            as="textarea" placeholder="Descrição"
                            rows={4} required style={style.input}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </Form.Group>

                    <Form.Group className="d-flex justify-content-end gap-3">
                        <Button
                            text="Cancelar" onClick={onClose}
                            customClass="red medium"
                            disabled={isSubmitting}
                        />
                        <Button
                            text={isSubmitting ? (
                                mode === "edit" ? "Salvando.." : "Criando..") : (
                                mode === "edit" ? "Salvar" : "Criar"
                            )} type="submit"
                            customClass="medium"
                            disabled={isSubmitting}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const style = {
    label: {
        fontSize: "0.875rem",
    },
    input: {
        fontSize: "0.75rem",
        lineHeight: "1.25rem",
    }
}

function getInitialState(mode, task) {
    return mode === "edit" && task ? {
        title: task.taskname || "",
        description: task.taskdescription || "",
        date: task.createdAt || "",
        priority: task.taskpriority || "",
        status: task.taskstatus || "false",
    } : {
        title: "",
        description: "",
        priority: "",
        status: "false",
    };
};