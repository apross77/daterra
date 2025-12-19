FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Porta definida pelo EasyPanel (documentação)
EXPOSE 4000

CMD ["npm", "start"]

