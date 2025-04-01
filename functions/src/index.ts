import { onRequest } from "firebase-functions/v2/https";
import * as cors from "cors";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

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
const emailConfig = functions.config().email as { user: string; pass: string };

// Configurar o transporter do nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailConfig.user, // Usando variáveis do Firebase
    pass: emailConfig.pass,
  },
});

// Função para enviar e-mails
export const sendEmail = onRequest({timeoutSeconds:300}, async (req, res) => {
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
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ error: "Erro ao enviar e-mail" });
    }
  });
});
