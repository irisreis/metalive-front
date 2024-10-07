// Importando as bibliotecas necessárias
import express from 'express'; // Importa o Express
import admin from 'firebase-admin'; // Importa o Firebase Admin SDK
import cors from 'cors'; // Importa o CORS para lidar com as requisições

// Inicializando o aplicativo Express
const app = express();
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Permite que o Express parseie JSON

// Inicializando o Firebase Admin com a chave do serviço
const serviceAccount = import('./config/serviceAccountKey.json', { assert: { type: 'json' } }); // Caminho para a chave do serviço

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Configurando a credencial
});

// Exemplo de rota
app.get('/', (req, res) => {
  res.send('Servidor do Firebase Admin está funcionando!');
});

// Definindo a porta em que o servidor irá escutar
const PORT = process.env.PORT || 3000; // Usa a porta definida pelo ambiente ou 3000 como padrão

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
