FROM node:lts as builder
LABEL authors="hanjiawei"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir app
WORKDIR /app

COPY package.json .
RUN npm install --registry=https://registry.npm.taobao.org

COPY . .
RUN npm run build

FROM nginx:1.25.1
COPY --from=builder /app/dist /usr/share/nginx/html