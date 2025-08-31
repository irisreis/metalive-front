const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const apiKey = "APP_USR-3100702237567489-062116-d6b76ce6047bb873760dd105c37b7cf5-2064672424"; // Substitua pela sua chave PRIVADA do mercado pago
const dominioMetalive = "https://metalive-8b9e7.web.app";

exports.confirmarPagamento = functions.https.onRequest((req, res) => {
    const corsHandler = cors({ origin: true });

    corsHandler(req, res, async () => {
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
            const {
                email,
                nome,
                numeroTelefone,
                password,
                token,
                paymentMethodId,
                billingAddress,
                installments,
                issuerId,
            } = req.body;

            if (!email || !password || !token || !paymentMethodId || !installments || !issuerId) {
                return res.status(400).send("Parâmetros obrigatórios ausentes.");
            }

            const pagamentoValor = 1; // R$ 1,00 fixo para teste

            const timestamp = Date.now()
            const textoParaHash = `${email}${token}${timestamp}`;

            const encoder = new TextEncoder();
            const dados = encoder.encode(textoParaHash);

            const hashBuffer = await crypto.subtle.digest('SHA-256', dados);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHexResult = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            const respostaPagamento = await axios.post(
                "https://api.mercadopago.com/v1/payments",
                {
                    transaction_amount: Number(pagamentoValor),
                    token: token,
                    description: "Pagamento Plano Metalive",
                    installments: Number(installments),
                    payment_method_id: paymentMethodId,
                    issuer_id: issuerId,
                    payer: { email },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Idempotency-Key": hashHexResult,
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );

            const pagamentoData = respostaPagamento.data;

            if (pagamentoData.status === "approved") {
                let usuarioId;

                try {
                    const userRecord = await admin.auth().getUserByEmail(email);
                    usuarioId = userRecord.uid;
                } catch (error) {
                    if (error.code === 'auth/user-not-found') {

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
                    } else {
                        console.error("Erro ao buscar ou criar usuário:", error);
                        throw new functions.https.HttpsError("internal", "Erro ao criar usuário", error);
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
                    token: token,
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

        } catch (error) {
            console.error("Erro ao processar pagamento:", error?.response?.data || error);
            res.set("Access-Control-Allow-Origin", dominioMetalive);
            return res.status(500).send("Erro interno ao processar pagamento.");
        }
    });
});