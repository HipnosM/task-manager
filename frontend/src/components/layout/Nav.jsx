import styles from "./Nav.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaUser } from "react-icons/fa";

export default function Nav() {
    const [linkActive, setLinkActive] = useState("/");

    function toggleLinkStats(path) {
        setLinkActive(path);

    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to={"/"}>Logo</Link>
            </div>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <Link
                        to={"/"}
                        onClick={() => toggleLinkStats("/")}
                        className={linkActive === "/" ? styles.active : ""} >
                        <FaHome />
                        Início
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        to={"/tasks"}
                        onClick={() => toggleLinkStats("/tasks")}
                        className={linkActive === "/tasks" ? styles.active : ""}>
                        <FaTasks />
                        Tarefas
                    </Link>
                </li>
                <li className={styles.item}>
                    <Link
                        to={"/my-account"}
                        onClick={() => toggleLinkStats("/my-account")}
                        className={linkActive === "/my-account" ? styles.active : ""}>
                        <FaUser />
                        Conta
                    </Link>
                </li>
            </ul>
        </nav>
    );
};