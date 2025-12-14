FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]

# docker build -t backend-test .                              
# docker run -d -p 3001:3001 backend-test                     