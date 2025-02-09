import styles from "./Home.module.css";
import hero from "../../assets/hero.svg"
import Button from "../layout/Button";
import { FaPlusCircle } from "react-icons/fa";

export default function Home() {
    return (
        <section className={styles.home_container}>
            <h1 className={styles.title}><span>Gerencie</span> suas <span>tarefas</span> de forma simples e rápida!</h1>

            <img src={hero} alt="hero, dois personagens com uma tasklist" />

            <Button
                text="Criar tarefa"
                icon={<FaPlusCircle />}
            />
        </section>
    );
};