import prisma from "../config/prismaCLI.js";
import bcrypt from "bcryptjs";

// Verificar se o usuário existe
const userExists = async (userName, userEmail) => await prisma.user.findFirst({
    where: {
        OR: [
            { name: userName },
            { email: userEmail }
        ]
    }
});

// Registrar usuário
const userRegister = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: "Insira corretamente todos os campos." });

    const user = await userExists(name, email);
    if (user) return res.status(400).json({ error: "Usuário já existe, faça login!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error("erro ao criar um usuário", error);
        res.status(500).json({ error: "Ocorreu um erro ao registrar o usuário!" })
    };
};

// Logar usuário
const userLogin = async (req, res) => {
    const { name, email, password } = req.body;

    if ((!name && !email) || !password) return res.status(400).json({ error: "Insira corretamente todos os campos." });


    try {
        const user = await userExists(name, email);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Senha inválida, tente novamente." });

        res.status(200).json({ message: "Logado com sucesso!" });
    } catch (error) {
        console.error("Erro ao fazer login", error);
        res.status(500).json({ error: "Erro ao fazer login." });
    };
};



export { userRegister, userLogin };