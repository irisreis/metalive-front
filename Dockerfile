# Use a imagem base do Node.js
FROM node:18

# Crie um diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do seu projeto para o diretório de trabalho
COPY . .

# Construa o projeto Angular
RUN npm run build --prod

# Instale o http-server para servir o conteúdo
RUN npm install -g http-server

# Exponha a porta que o servidor irá utilizar
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["http-server", "dist/nome-do-seu-app-angular", "-p", "8080"]
