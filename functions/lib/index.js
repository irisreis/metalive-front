"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const cors = require("cors");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
// Inicializa o Firebase Admin (evita múltiplas execuções)
if (admin.apps.length === 0) {
    admin.initializeApp();
}
// Configurar CORS
const corsHandler = cors({
    origin: true, // Permite todas as origens
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
// Obtenha a configuração corretamente tipada
const emailConfig = functions.config().email;
// Configurar o transporter do nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailConfig.user, // Usando variáveis do Firebase
        pass: emailConfig.pass,
    },
});
// Função para enviar e-mails
exports.sendEmail = (0, https_1.onRequest)({ timeoutSeconds: 300 }, async (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method === "OPTIONS") {
            res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.set("Access-Control-Allow-Origin", "*"); // Permitir todas as origens
            return res.status(204).send(""); // Retorna sem conteúdo (padrão para OPTIONS)
        }
        if (req.method !== "POST") {
            return res.status(405).send("Método não permitido");
        }
        const { nome, email, mensagem } = req.body;
        const mailOptions = {
            from: email,
            to: emailConfig.user,
            subject: `Contato de ${nome}`,
            text: mensagem,
        };
        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "E-mail enviado com sucesso!" });
        }
        catch (error) {
            console.error("Erro ao enviar e-mail:", error);
            return res.status(500).json({ error: "Erro ao enviar e-mail" });
        }
    });
});
//# sourceMappingURL=index.js.map