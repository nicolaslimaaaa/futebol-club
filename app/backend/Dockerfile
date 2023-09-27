FROM node:16.14-alpine
WORKDIR /app-backend
COPY package*.json ./
COPY packages.npm ./
RUN npm ci
COPY . .
EXPOSE 3001
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]