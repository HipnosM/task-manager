import styles from "./Button.module.css";

export default function Button({ customClass, text, icon, type = "", onClick }) {
    const classNames = `${styles.button} ${customClass ? customClass.split(" ").map(cls => styles[cls] || cls).join(" ") : ""}`;

    return (
        <div>
            <button
                type={type}
                className={classNames}
                style={{ gap: icon ? "1rem" : "0"}}
                onClick={type === "button" ? onClick : () => { }}
            >
                {text}
                <span className={styles.icon}>{icon}</span>
            </button>
        </div>
    )
};