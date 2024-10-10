"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = exports.gerarCardHash = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
// Habilitar CORS
const corsHandler = (0, cors_1.default)({ origin: true });
exports.gerarCardHash = (0, https_1.onRequest)(async (request, response) => {
    corsHandler(request, response, async () => {
        try {
            const { card_number, card_holder_name, card_expiration_date, card_cvv } = request.body;
            console.log("Dados do cartão recebidos:", { card_number, card_holder_name, card_expiration_date, card_cvv });
            // Conectar ao Pagar.me
            const pagarMeUrl = "https://api.pagar.me/1/security/encode_card"; // Endpoint correto para gerar o card_hash
            // Chave de encriptação pública do Pagar.me
            const encryptionKey = process.env.PAGARME_ENCRYPTION_KEY; // Certifique-se de definir essa variável de ambiente
            console.log("Chave de encriptação:", encryptionKey);
            // Formatar os dados do cartão para envio
            const cardData = {
                card_number,
                card_holder_name,
                card_expiration_date,
                card_cvv
            };
            // Fazer a requisição para o Pagar.me para gerar o card_hash
            const pagarMeResponse = await axios_1.default.post(pagarMeUrl, cardData, {
                headers: {
                    //Comentar a linha abaixo para desabilitar o token
                    "Authorization": `Bearer ${encryptionKey}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Resposta do Pagar.me:", pagarMeResponse.data);
            // Agora TypeScript sabe que pagarMeResponse.data tem a propriedade card_hash
            const { card_hash } = pagarMeResponse.data;
            // Retornar o card_hash gerado pelo Pagar.me
            response.status(200).send({ card_hash });
        }
        catch (error) {
            console.error("Erro ao gerar card hash:", error);
            response.status(500).send({ error: "Error generating card hash" });
        }
    });
});
// Função para processar o pagamento
exports.processPayment = (0, https_1.onRequest)(async (request, response) => {
    corsHandler(request, response, async () => {
        try {
            const paymentData = request.body;
            // URL do endpoint do Pagar.me para processar pagamento
            const pagarMeUrl = "https://api.pagar.me/1/transactions";
            // Obtenha a chave API das variáveis de ambiente
            const pagarMeApiKey = process.env.PAGARME_KEY;
            const pagarMeResponse = await axios_1.default.post(pagarMeUrl, paymentData, {
                headers: {
                    "Authorization": `Bearer ${pagarMeApiKey}`,
                    "Content-Type": "application/json",
                },
            });
            response.status(200).send(pagarMeResponse.data);
        }
        catch (error) {
            logger.error("Error processing payment", error);
            response.status(500).send("Error processing payment");
        }
    });
});
//# sourceMappingURL=index.js.map