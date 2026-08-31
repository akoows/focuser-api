import express from "express";
import cors from "cors";
import { router } from "./src/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check — evita 404 em "/" e confirma que a API está viva
app.get("/", (req, res) => {
    res.json({ status: "ok", service: "focuser-api", time: new Date().toISOString() });
});

// Rotas
app.use(router);
console.log("✅ Rotas de aplicação carregadas");

// Tratamento global de erros — responde JSON em vez do HTML padrão
// (inclui erros de JSON inválido do body-parser e erros async do Express 5)
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Erro: ${err.message}`);
    res.status(err.status || 500).json({ error: err.message || "Erro interno" });
});

// Iniciando servidor — porta 80 (requerida pela plataforma)
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});