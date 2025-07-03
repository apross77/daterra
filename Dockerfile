# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia todos os arquivos para dentro do container
COPY . .

# Instala as dependências
RUN npm install

# Expõe a porta que seu app usa
EXPOSE 3000

# Comando para rodar sua aplicação
CMD ["node", "src/index.js"]
