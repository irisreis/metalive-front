import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import * as cors from 'cors';

// Configurar CORS
const corsHandler = cors({ 
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Função para processar o pagamento
export const processPayment = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    console.log("Executando CORS Handler");

    if (request.method === 'OPTIONS') {
      return response.status(204).send(''); // Responde ao pré-vôo CORS
    }

    try {
      const paymentData = request.body; // Receber os dados do pagamento do frontend

      const pagarMeUrl = "https://api.pagar.me/core/v5/orders"; // URL da API Pagar.me
      const pagarMeApiKey = 'sk_test_2e5e6caadb384a6997370ad5bb6a1ee4'; // Chave de API
      console.log("Chave de API Pagar.me:", pagarMeApiKey); // Logando a chave

      const basicAuthKey = Buffer.from(`${pagarMeApiKey}:`).toString('base64');

      const pagarMeResponse = await axios.post(pagarMeUrl, paymentData, {
        headers: {
          "Authorization": `Basic ${basicAuthKey}`,
          "Content-Type": "application/json",
        },
      });

      return response.status(200).send(pagarMeResponse.data);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return response.status(500).send({ error: "Erro ao processar o pagamento", details: error.response?.data || error.message });
      } else if (error instanceof Error) {
        return response.status(500).send({ error: "Erro ao processar o pagamento", details: error.message });
      } else {
        return response.status(500).send({ error: "Erro desconhecido ao processar o pagamento" });
      }
    }
  });
});
