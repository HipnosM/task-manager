import { Children, createContext, useContext, useEffect, useState } from "react";
import api from "../../api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await api.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Erro ao carregar usuário.", error);
                api.logout();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (credentials) => {
        try {
            await api.login(credentials);
            const userData = await api.getCurrentUser();
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        api.logout();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            isLoading,
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
};