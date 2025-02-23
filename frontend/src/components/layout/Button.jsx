import styles from "./Button.module.css";

export default function Button({ customClass, text, icon, type="" }) {
    return (
        <div>
            <button type={type} className={`${styles.button} ${styles[customClass]}`}>
                {text}
                <span className={styles.icon}>{icon}</span>
            </button>
        </div>
    )
};