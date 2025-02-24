import styles from "./Button.module.css";

export default function Button({ customClass, text, icon, type="", onClick }) {
    return (
        <div>
            <button type={type} className={`${styles.button} ${styles[customClass]}`} onClick={type === "button" ? onClick : () => {}}>
                {text}
                <span className={styles.icon}>{icon}</span>
            </button>
        </div>
    )
};