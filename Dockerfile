# 開発用ステージ
FROM node:18-alpine as development-stage

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバー用のポート
EXPOSE 8080

# 開発モードで起動
CMD ["npm", "run", "serve"]

# ビルドステージ
FROM node:18-alpine as build-stage

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションのビルド
RUN npm run build

# 本番ステージ
FROM nginx:alpine as production-stage

# Nginxの設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ビルドステージで生成したファイルをコピー
COPY --from=build-stage /app/dist /usr/share/nginx/html

# ポート公開
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
