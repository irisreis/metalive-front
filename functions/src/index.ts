import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios"; // Importando axios

// Função de exemplo
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Função para processar o pagamento
export const processPayment = onRequest(async (request, response) => {
  try {
    const paymentData = request.body;

    // Substitua com a URL do endpoint do Pagar.me
    const pagarMeUrl = "https://api.pagar.me/1/transactions";

    const pagarMeResponse = await axios.post(pagarMeUrl, paymentData, {
      headers: {
        "Authorization": "Bearer YOUR_PAGARME_API_KEY",
        "Content-Type": "application/json",
      },
    });

    response.status(200).send(pagarMeResponse.data);
  } catch (error) {
    logger.error("Error processing payment", error);
    response.status(500).send("Error processing payment");
  }
});
