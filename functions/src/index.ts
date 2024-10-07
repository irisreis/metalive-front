import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import cors from 'cors';

// Habilitar CORS
const corsHandler = cors({ origin: true });

// Definir uma interface para a resposta esperada
interface PagarMeResponse {
  card_hash: string; // A propriedade card_hash esperada
}

export const gerarCardHash = onRequest(async (request, response) => {
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
      const pagarMeResponse = await axios.post<PagarMeResponse>(pagarMeUrl, cardData, {
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

    } catch (error) {
      console.error("Erro ao gerar card hash:", error);
      response.status(500).send({ error: "Error generating card hash" });
    }
  });
});

// Função para processar o pagamento
export const processPayment = onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const paymentData = request.body;

      // URL do endpoint do Pagar.me para processar pagamento
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
