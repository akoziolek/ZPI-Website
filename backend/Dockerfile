FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 3001

CMD ["nodemon", "--legacy-watch", "server.js"]


# docker build -t backend-test .                              
# docker run -d -p 3001:3001 backend-test                     