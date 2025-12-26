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

----------------------------------
- name: Trigger frontend pipeline
              run: |
                curl -X POST \
                  -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
                  -H "Accept: application/vnd.github+json" \
                  https://api.github.com/repos/${{ github.repository }}/dispatches \
                  -d '{"event_type":"backend_deployed"}'


https://github.com/settings/tokens
Tạo token có các quyền sau
Scopes define the access for personal tokens. Read more about OAuth scopes.
```bash
repoFull control of private repositories
  repo:statusAccess commit status
  repo_deploymentAccess deployment status
  public_repoAccess public repositories
  repo:inviteAccess repository invitations
  security_eventsRead and write security events
workflowUpdate GitHub Action workflows
```

Tiếp vào link sau:chọn Actions -> General, phần Workflow permissions đã được set là Read and write permissions.
```bash
https://github.com/skipperhoa/react-nextjs-app-router-docker/settings/actions
```
Nếu bạn dùng GitHub Organization (Tổ chức)
Nếu hai repo nằm trong một Organization, bạn cần đảm bảo:
Trong phần cài đặt Organization, mục Actions -> General, phần Workflow permissions đã được set là Read and write permissions.
Kiểm tra xem repo frontend có chặn các workflow bên ngoài không (thường mặc định là cho phép).
Tại sao lại là lỗi 403? GitHub trả về 403 thay vì 404 để xác nhận rằng tài nguyên có tồn tại, nhưng danh tính (token) bạn cung cấp không có quyền can thiệp vào tài nguyên đó. Việc dùng PAT sẽ giải quyết triệt để vấn đề này.

