# Dockerfile

# ベースイメージ (Node.js LTS Alpine)
FROM node:18-alpine

# 作業ディレクトリ
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール (lockファイルに基づいて正確に)
RUN npm ci

# プロジェクトコード全体をコピー
# (node_modules は .dockerignore で除外されるためコピーされない)
COPY . .

# 開発サーバー用のポート (Vue CLI v3+ のデフォルトは 8080)
EXPOSE 8080

# 開発サーバー起動コマンド (npm run serve)
CMD ["npm", "run", "serve"]