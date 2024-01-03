FROM node:18.19.0
WORKDIR /app
COPY package.json /app
RUN npm install
COPY src /app/src
COPY public /app/public
EXPOSE 3000
CMD ["npm", "start"]