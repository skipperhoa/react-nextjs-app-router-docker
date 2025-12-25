📌 Lấy IP gateway:
```bash
ip route | grep docker
```
Example:
```bash
[root@cloudvps1588 ~]# ip route | grep docker
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1
```

📌 Cách CHUẨN HƠN (khuyên dùng): tạo network riêng


🔧 Tạo network
```bash
docker network create app-net
```

🔧 Dừng & xoá container cũ (KHÔNG mất data)
```bash
docker rm -f postgres-prod hoacode-nodejs-app
```

🔧 Chạy Postgres

```bash
docker run -d \
  --name postgres-prod \
  --network app-net \
  --restart always \
  -e POSTGRES_DB=hoadev_db \
  -e POSTGRES_USER=hoadev \
  -e POSTGRES_PASSWORD=hoadev123 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:18-alpine
```

🔧 Chạy Node.js
```bash
docker run -d \
  --name nodejs-app \
  --network app-net \
  -p 3000:3000 \
  hoadev92/hoacode-nodejs-app:latest

```

👉 Lúc này connect ĐƯỢC
```bash
host: 'postgres-prod'
```

