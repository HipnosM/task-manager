import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase.js";

const router = express.Router();
const SECRET_KEY = "JUST_A_TEST";

// gerar token
const generateToken = (userId, userName, userEmail) => {
  return jwt.sign({ userId, userName, userEmail }, SECRET_KEY, { expiresIn: "1h" });
};

// registrar novo usuário
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) return res.status(400).json({ error: "Todos os campos são obrigatórios." });

  // verificar se o usuário já existe
  const { data: userExists } = await supabase
    .from("users")
    .select("*")
    .or(`name.eq.${name}, email.eq.${email}`)
    .single();
  if (userExists) return res.status(400).json({ error: "Usuário já cadastrado, faça login." });

  // encriptar a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // criar novo usuário
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }]);
  if (error) return res.status(400).json({ error: "Erro ao cadastrar usuário." });

  res.status(201).json({ message: "Usuário cadastrado com sucesso." });
});

// fazer login
router.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .or(`name.eq.${name}, email.eq.${email}`)
    .single();
  if (error || !user) return res.status(400).json({ error: "Usuário não encontrado." });
  // verificar se a senha está correta
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Senha incorreta." });

  // criar token com id, username e email
  const token = generateToken(user.id, user.username, user.email);
  res.json({ message: "Login realizado com sucesso.", token });
});

// verificar o token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token não encontrado." });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "Token inválido." });
    req.user = user;
    next();
  });
};

export { router as authRoutes, authenticateToken };