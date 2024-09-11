const functions = require('firebase-functions');
const axios = require('axios'); // Para fazer requisições HTTP para a API do Pagar.me

// Configure a função para processar pagamentos
exports.processPayment = functions.https.onRequest(async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body; // Receber dados do frontend
    
    // Configurar e enviar a requisição para o Pagar.me
    const response = await axios.post('https://api.pagar.me/1/transactions', {
      api_key: 'SUA_CHAVE_DE_API',
      amount: amount,
      payment_method: paymentMethod
      // Adicione outros parâmetros necessários conforme a documentação do Pagar.me
    });

    // Enviar o resultado da transação de volta para o frontend
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send('Erro ao processar o pagamento');
  }
});
cd