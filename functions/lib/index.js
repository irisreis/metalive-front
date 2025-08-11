"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmarPagamento = void 0;
// Importações de bibliotecas
const https_1 = require("firebase-functions/v2/https");
const cors = require("cors");
const admin = require("firebase-admin");
//import * as nodemailer from "nodemailer";
const axios_1 = require("axios");
// Inicialização do Firebase Admin e Firestore
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const crypto = require('crypto').webcrypto;
const db = admin.firestore();
// Configurações do Mercado Pago
const apiKey = "TEST-3363989537801169-061715-bdc3a76bcb3f525541fb8040784cdf10-2494312096";
const dominioMetalive = "https://metalive-8b9e7.web.app";
// Middleware CORS
const corsHandler = cors({ origin: true });
// Função confirmarPagamento – 2ª geração
exports.confirmarPagamento = (0, https_1.onRequest)({ timeoutSeconds: 300 }, (req, res) => {
    corsHandler(req, res, async () => {
        var _a;
        if (req.method === "OPTIONS") {
            res.set("Access-Control-Allow-Origin", dominioMetalive);
            res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            return res.status(204).send("");
        }
        if (req.method !== "POST") {
            return res.status(405).send("Método não permitido");
        }
        try {
            const { email, nome, numeroTelefone, password, token, paymentMethodId, billingAddress, installments, issuerId, } = req.body;
            if (!email || !password || !token || !paymentMethodId || !installments || !issuerId) {
                return res.status(400).send("Parâmetros obrigatórios ausentes.");
            }
            const pagamentoValor = 1; // Valor fixo para teste
            const timestamp = Date.now();
            const textoParaHash = `${email}${token}${timestamp}`;
            const encoder = new TextEncoder();
            const dados = encoder.encode(textoParaHash);
            const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHexResult = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
            const respostaPagamento = await axios_1.default.post("https://api.mercadopago.com/v1/payments", {
                transaction_amount: Number(pagamentoValor),
                token: token,
                description: "Pagamento Plano Metalive",
                installments: Number(installments),
                payment_method_id: paymentMethodId,
                issuer_id: issuerId,
                payer: { email },
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Idempotency-Key": hashHexResult,
                    Authorization: `Bearer ${apiKey}`,
                },
            });
            const pagamentoData = respostaPagamento.data;
            if (pagamentoData.status === "approved") {
                let usuarioId;
                try {
                    const userRecord = await admin.auth().getUserByEmail(email);
                    usuarioId = userRecord.uid;
                }
                catch (error) {
                    const err = error;
                    if (err.code === "auth/user-not-found") {
                        const userRecord = await admin.auth().createUser({
                            email,
                            password,
                            displayName: nome,
                            phoneNumber: numeroTelefone ? `+55${numeroTelefone.replace(/\D/g, "")}` : undefined,
                        });
                        usuarioId = userRecord.uid;
                        await db.collection("clientes").doc(usuarioId).set({
                            nome,
                            email,
                            numeroTelefone,
                            criadoEm: admin.firestore.FieldValue.serverTimestamp(),
                        });
                    }
                    else {
                        console.error("Erro ao buscar ou criar usuário:", error);
                        return res.status(500).send("Erro ao criar usuário.");
                    }
                }
                const pagamentoRef = db
                    .collection("pagamentos")
                    .doc(usuarioId)
                    .collection("historico");
                await pagamentoRef.add({
                    email,
                    nome,
                    numeroTelefone,
                    paymentMethodId,
                    token,
                    issuerId,
                    installments,
                    valor: pagamentoValor,
                    status: pagamentoData.status,
                    detalhes: pagamentoData,
                    endereco: billingAddress,
                    criadoEm: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
            res.set("Access-Control-Allow-Origin", dominioMetalive);
            return res.status(200).json({
                status: pagamentoData.status,
                id: pagamentoData.id,
                aprovado: pagamentoData.status === "approved",
            });
        }
        catch (error) {
            console.error("Erro ao processar pagamento:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error);
            res.set("Access-Control-Allow-Origin", dominioMetalive);
            return res.status(500).send("Erro interno ao processar pagamento.");
        }
    });
});
// ---
// Função de envio de e-mail – 2ª geração
// const emailConfig = {
//   user: process.env.EMAIL_USER || "",
//   pass: process.env.EMAIL_PASS || "",
// };
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: emailConfig.user,
//     pass: emailConfig.pass,
//   },
// });
// const corsHandlerEmail = cors({
//   origin: true,
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// });
// export const sendEmail = onRequest({ timeoutSeconds: 300 }, (req, res) => {
//   corsHandlerEmail(req, res, async () => {
//     if (req.method === "OPTIONS") {
//       res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//       res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//       res.set("Access-Control-Allow-Origin", "*");
//       return res.status(204).send("");
//     }
//     if (req.method !== "POST") {
//       return res.status(405).send("Método não permitido");
//     }
//     const { nome, email, mensagem } = req.body;
//     const mailOptions = {
//       from: email,
//       to: emailConfig.user,
//       subject: `Contato de ${nome}`,
//       text: mensagem,
//     };
//     try {
//       await transporter.sendMail(mailOptions);
//       return res.status(200).json({ message: "E-mail enviado com sucesso!" });
//     } catch (error) {
//       console.error("Erro ao enviar e-mail:", error);
//       return res.status(500).json({ error: "Erro ao enviar e-mail" });
//     }
//   });
// });
//# sourceMappingURL=index.js.map