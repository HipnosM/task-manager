import { useContext, useEffect, useState } from "react";
import { FaBackward, FaEdit, FaSave, FaSignOutAlt } from "react-icons/fa";
import Button from "../layout/Button";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import styles from "./Account.module.css";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";

export default function Account() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        userName: "",
        userEmail: "",
        userTasks: []
    });

    useEffect(() => {
        if (user) {
            setUserData({
                userName: user.name,
                userEmail: user.email,
                userTasks: user.Task || []
            })
        }
        setIsSubmitting(false);
        setIsEditing(false);
    }, [user]);

    const handleLogout = () => {
        setIsSubmitting(true);
        logout();
        navigate("/");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updatedUser = await api.updateUser({
                name: userData.userName,
                email: userData.userEmail
            });

            setUser(updatedUser);

            toast.success("Usuário atualizado com sucesso!");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || "Erro ao atualizar usuário.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id={styles.user_container}>
            <h2>Informações da Conta</h2>
            <div id={styles.user_infos}>
                {!isEditing ? (
                    <div id={styles.infos_content}>
                        <div className={styles.infos_group}>
                            <p>Usuário</p>
                            <p>{userData.userName}</p>
                        </div>
                        <div className={styles.infos_group}>
                            <p>E-mail</p>
                            <p>{userData.userEmail}</p>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                text="Editar"
                                icon={<FaEdit />}
                                customClass="medium"
                                onClick={() => setIsEditing(true)}
                            />
                        </div>

                        <div id={styles.infos_tasks_container}>
                            <h3 id={styles.infos_tasks_title}>Estatísticas</h3>
                            <div id={styles.infos_tasks}>
                                <article className={styles.info_item}>
                                    {console.log(user, userData)}
                                    <span className={styles.item_label}>{userData.userTasks.length}</span>
                                    <p>
                                        <span>Tarefas</span>
                                    </p>
                                </article>

                                <article className={styles.info_item}>
                                    <span className={styles.item_label}>
                                        {userData.userTasks.filter(task => task.taskstatus).length}
                                    </span>
                                    <p>
                                        <span>Tarefas</span>
                                        <span>concluídas</span>
                                    </p>
                                </article>

                                <article className={styles.info_item}>
                                    <span className={styles.item_label}>
                                        {userData.userTasks.filter(task => !task.taskstatus).length}
                                    </span>
                                    <p>
                                        <span>Tarefas</span>
                                        <span>pendentes</span>
                                    </p>
                                </article>
                            </div>
                        </div>

                        <div id={styles.infos_tasks_footer}>
                            <Button
                                text={isSubmitting ? "Saindo.." : "Sair"}
                                icon={<FaSignOutAlt />}
                                customClass="medium transparent_red"
                                onClick={handleLogout}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                ) : (
                    <form id={styles.infos_content_form}>
                        <div className={styles.input_group}>
                            <label htmlFor="userName">Usuário</label>
                            <input type="text" id="userName"
                                value={userData.userName}
                                onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
                            />
                        </div>
                        <div className={styles.input_group}>
                            <label htmlFor="userEmail">E-mail</label>
                            <input type="email" id="userEmail"
                                value={userData.userEmail}
                                onChange={(e) => setUserData({ ...userData, userEmail: e.target.value })}
                            />
                        </div>

                        <div className={styles.actions}>
                            <Button
                                text="Cancelar"
                                customClass="medium red"
                                onClick={() => setIsEditing(false)}
                            />
                            <Button
                                text="Salvar"
                                icon={<FaSave />}
                                customClass="medium"
                                type="submit"
                                onClick={handleSave}
                            />
                        </div>
                    </form>
                )}
            </div>

        </section>
    );
};