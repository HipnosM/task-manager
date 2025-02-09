import styles from "./Button.module.css";
import { Link } from "react-router-dom";

export default function Button({ customClass, text, icon }) {
    return (
        <div>
            <Link to={"#"} className={`${styles.button} ${styles[customClass]}`}>
                {text}
                <span className={styles.icon}>{icon}</span>
            </Link>
        </div>
    )
};