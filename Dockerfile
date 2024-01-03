# Build node server
FROM node:18.19.0 as builder
WORKDIR /app
COPY package.json /app
RUN npm install --omit=dev
COPY src /app/src
COPY public /app/public
COPY build.sh /app/build.sh
RUN chmod +x build.sh
RUN npm run-script build

# Use an Nginx alpine image to serve the static files
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
