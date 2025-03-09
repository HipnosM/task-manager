import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Redirecionamento após login
import styles from "./Login.module.css";
import Button from "../layout/Button";

import Hero from "../../assets/hero_login.png";

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

    const [error, setError] = useState("");

    const navigate = useNavigate(); // Hook para redirecionar após login

    const changeForm = () => {
        setFormRegister(!formRegister);
        setError("");
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
    console.log(url);
    // ✅ Função de Registro de Usuário
    const handleRegister = async (event) => {
        event.preventDefault();

        if (userData.userPass !== userData.userRepass) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch(`${url}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: userData.userName,
                    email: userData.userEmail,
                    password: userData.userPass
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao registrar usuário.");
            }

            alert("Usuário registrado com sucesso! Agora faça login.");
            setFormRegister(false); // Alterna para a tela de login
        } catch (err) {
            setError(err.message);
        }
    };

    // ✅ Função de Login do Usuário
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${url}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userOrEmail: loginData.userOrEmail,
                    password: loginData.userPass
                })
            });
            
            const data = await response.json();
            console.log(data);
            console.log(loginData);
            if (!response.ok) throw new Error(data.error || "Erro ao fazer login.");

            localStorage.setItem("token", data.token); // ✅ Salva o token JWT no localStorage
            console.log("Usuário autenticado com sucesso!");

            navigate("/home"); // ✅ Redireciona para a página de tarefas após login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Bem-vindo(a) ao <span>Task Manager</span>!</h1>

            {error && <p className={styles.error}>{error}</p>}

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
                            <Button text="Registrar" customClass="green" type="submit" />
                            {/* <button type="submit">Registrar</button> */}
                        </div>
                        <p onClick={changeForm}>Entrar com uma conta existente!</p>
                    </form>
                </div>
            ) : (
                <div className={styles.form__container}>
                    <img src={Hero} alt="" />
                    <form onSubmit={handleLogin} id={styles.login}>
                        <h2>Login</h2>
                        <div className={styles.input__group}>
                            <input type="text" id="userOrEmail" placeholder="Usuário ou e-mail" value={loginData.userOrEmail} onChange={(e) => handleInputChange(e, false)} required />
                            <input type="password" id="userPass" placeholder="Senha" value={loginData.userPass} onChange={(e) => handleInputChange(e, false)} required />
                        </div>
                        <div className={styles.submit__button}>
                            <Button text="Entrar" customClass="green" type="submit" />
                            {/* <button type="submit">Registrar</button> */}
                        </div>
                        <p onClick={changeForm}>Entrar com uma nova conta!</p>
                    </form>
                </div>
            )}
        </section>
    );
}