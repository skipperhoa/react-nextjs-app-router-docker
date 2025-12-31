# Giai đoạn build chung (Base)
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# --- ĐÂY LÀ ĐOẠN QUAN TRỌNG ---
# Giai đoạn chạy Test (phải có chữ AS test)
FROM base AS test
COPY . .
# Chạy lệnh test của bạn, ví dụ: npm test
# Trong CI, lệnh này thường được ghi đè bởi lệnh docker run, 
# nhưng khai báo stage ở đây là bắt buộc.
CMD ["npm", "test"]

# Giai đoạn chạy Production (phải có chữ AS production)
FROM base AS production
COPY . .
EXPOSE 9000
CMD ["node", "src/server.js"]