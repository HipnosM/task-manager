import { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom"; // Redirecionamento após login
import styles from "./Login.module.css";
import Button from "../layout/Button";
import { FaSignInAlt, FaUserCheck } from "react-icons/fa";

import Hero from "../../assets/hero_login.png";
import api from "../../api/api";
import toast from "react-hot-toast";

export default function Login() {
    const [formRegister, setFormRegister] = useState(true);
    const [userData, setUserData] = useState({
        userName: "",
        userEmail: "",
        userPass: "",
        userRepass: ""
    });
    const [loginData, setLoginData] = useState({
        userOrEmail: "",
        userPass: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate(); // Hook para redirecionar após login

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home", { replace: true });
        }
        setIsSubmitting(false);
    }, [navigate, formRegister]);

    const changeForm = () => {
        setFormRegister(!formRegister);
    };

    const handleInputChange = (event, isRegister) => {
        const { id, value } = event.target;
        if (isRegister) {
            setUserData((prevData) => ({ ...prevData, [id]: value }));
        } else {
            setLoginData((prevData) => ({ ...prevData, [id]: value }));
        }
    };

    const url = import.meta.env.VITE_API_URL;
    // ✅ Função de Registro de Usuário
    const handleRegister = async (event) => {
        event.preventDefault();

        if (userData.userPass !== userData.userRepass) {
            toast.error("As senhas não coincidem!", { icon: "❌" });
            return;
        }

        setIsSubmitting(true);
        
        api.register({
            name: userData.userName,
            email: userData.userEmail,
            password: userData.userPass
        })
            .then(() => {
                toast.success("Usuário registrado com sucesso!", { icon: "✅" });
                setFormRegister(false);
            })
            .catch((error) => {
                toast.error(error.message, { icon: "❌" });
                setIsSubmitting(false);
            });
    };

    // ✅ Função de Login do Usuário
    const handleLogin = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        await api.login({
            userOrEmail: loginData.userOrEmail,
            password: loginData.userPass
        })
            .then(() => {
                toast.success("Login realizado com sucesso!", { icon: "✅" });
                setTimeout(() => navigate("/home", { replace: true }), 2500);
            })
            .catch((error) => {
                toast.error(error.message, { icon: "❌" });
                setIsSubmitting(false);
            });
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Bem-vindo(a) ao <span>Task Manager</span>!</h1>

            {formRegister ? (
                <div className={styles.form__container}>
                    <img src={Hero} alt="" />
                    <form onSubmit={handleRegister}>
                        <h2>Registre-se</h2>
                        <div className={styles.input__group}>
                            <input type="text" id="userName" placeholder="Usuário" value={userData.userName} onChange={(e) => handleInputChange(e, true)} required />
                            <input type="email" id="userEmail" placeholder="exemplo@gmail.com" value={userData.userEmail} onChange={(e) => handleInputChange(e, true)} required />
                            <input type="password" id="userPass" placeholder="Digite uma senha" value={userData.userPass} onChange={(e) => handleInputChange(e, true)} required />
                            <input type="password" id="userRepass" placeholder="Confirme sua senha" value={userData.userRepass} onChange={(e) => handleInputChange(e, true)} required />
                        </div>
                        <div className={styles.submit__button}>
                            <Button text={isSubmitting ? "Registrando..." : "Registrar"}
                                customClass="green" type="submit" icon={<FaUserCheck />}
                                disabled={isSubmitting}
                            />
                            {/* <button type="submit">Registrar</button> */}
                        </div>
                        <p onClick={changeForm}>Entrar com uma conta existente!</p>
                    </form>
                </div>
            ) : (
                <div className={styles.form__container}>
                    <img src={Hero} alt="" />
                    <form onSubmit={handleLogin} id={styles.login} disabled={isSubmitting}>
                        <h2>Login</h2>
                        <div className={styles.input__group}>
                            <input type="text" id="userOrEmail" placeholder="Usuário ou e-mail" value={loginData.userOrEmail} onChange={(e) => handleInputChange(e, false)} required />
                            <input type="password" id="userPass" placeholder="Senha" value={loginData.userPass} onChange={(e) => handleInputChange(e, false)} required />
                        </div>
                        <div className={styles.submit__button}>
                            <Button text={isSubmitting ? "Entrando..." : "Entrar"}
                                customClass="green" type="submit" icon={<FaSignInAlt />}
                                disabled={isSubmitting}
                            />
                            {/* <button type="submit">Registrar</button> */}
                        </div>
                        <p onClick={changeForm}>Entrar com uma nova conta!</p>
                    </form>
                </div>
            )}
        </section>
    );
}