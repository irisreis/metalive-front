import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import cors from 'cors'; // Importação padrão do pacote 'cors'

// Função de exemplo
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// Inicialize o middleware CORS
const corsHandler = cors({ origin: true });

export const processPayment = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const paymentData = request.body;

      // Substitua com a URL do endpoint do Pagar.me
      const pagarMeUrl = "https://api.pagar.me/1/transactions";

      // Obtenha a chave API das variáveis de ambiente
      const pagarMeApiKey = process.env.PAGARME_KEY;

      const pagarMeResponse = await axios.post(pagarMeUrl, paymentData, {
        headers: {
          "Authorization": `Bearer ${pagarMeApiKey}`,
          "Content-Type": "application/json",
        },
      });

      response.status(200).send(pagarMeResponse.data);
    } catch (error) {
      logger.error("Error processing payment", error);
      response.status(500).send("Error processing payment");
    }
  });
});
