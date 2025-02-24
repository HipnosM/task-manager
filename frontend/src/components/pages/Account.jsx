import { FaSignOutAlt } from "react-icons/fa";
import Button from "../layout/Button";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const navigate = useNavigate();

    return (
        <section>
            <h1>Informações da Conta</h1>
            <Button
                text="Sair"
                icon={<FaSignOutAlt style={{color: "red"}} />}
                type="button"
                onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                }}
            />
        </section>
    );
};