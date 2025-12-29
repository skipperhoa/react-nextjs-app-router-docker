**CICD Node.js + React/Next.js to VPS** 

Thì vừa qua mình cũng xây dựng xong Node.js + React/Next.js , mọi thứ điều ổn định đúng không nào. Thì trong video này mình sẽ dùng CICD deploay project đến VPS 

Điều đầu tiên ta cần chuẩn bị như sau:

+ 1 VPS chạy  hệ điều hành Ubuntu hoặc Linux,…
+ Chúng ta cần cài đặt Docker trên VPS 
+ Cần tạo key ssh để gắn qua bên GitHub action setcret , để có thể sử dụng SSH bên git action 

1️⃣ Tạo SSH key trên máy local (Windows / Linux / macOS)

```bash
ssh-keygen -t ed25519 -C "github-actions@devninja.io.vn"
# Nếu máy quá cũ (hiếm gặp):
ssh-keygen -t rsa -b 4096 -C "github-actions@your-domain"
```
github-actions@devninja.io.vn : chỉ là tên mô tả

Ví dụ minh hoạ: 
```bash
nguye@HOADEV MINGW64 /c/laragon/www/hoacode (main)
$ ssh-keygen -t ed25519 -C "github-actions@devninja.io.vn"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/c/Users/nguye/.ssh/id_ed25519): 
Enter passphrase for "/c/Users/nguye/.ssh/id_ed25519" (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /c/Users/nguye/.ssh/id_ed25519
Your public key has been saved in /c/Users/nguye/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:X0JHR+Gl/gPBBEQlVKiLlsatjESVYixE3SsXYMyD83Q github-actions@devninja.io.vn
The key's randomart image is:
+--[ED25519 256]--+
|  oo*oo . +**=+..|
|   +.X E   o+o o |
|    * = o o .oo  |
|     + o o . ..  |
|    . + S o ...  |
|     . * + o  .. |
|    . = . .    ..|
|     . o        .|
|                 |
+----[SHA256]-----+
```

2️⃣ Thêm PUBLIC KEY vào VPS 
nhớ là tại máy `local` nhé, chứ không phải trên vps

```bash
nguye@HOADEV MINGW64 /c/laragon/www/hoacode (main)
$ cat /c/Users/nguye/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG3pfnGUFo6FhkygzEjFLTbvoTm7F1PJdxYWq+k1f35y github-actions@devninja.io.vn
```

Sau khi có key từ local , ta cần thực hiện bước sau trên VPS 
🔹 SSH vào VPS : `lúc này là ta cần lên vps nè`
```bash
ssh root@VPS_IP
```
Chúng ta có để dùng user `deploy`, nếu đã có tạo adduser `deploy` trên VPS 
```bash
ssh deploy@VPS_IP
```

🔹 Thêm key vào `authorized_keys` , cũng đang ở trên `VPS` nhé chổ nano mở file, ta hãy dán key vừa tạo ở phía trước, là cái này nè: Key của ta trước đó nè `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG3pfnGUFo6FhkygzEjFLTbvoTm7F1PJdxYWq +k1f35y github-actions@devninja.io.vn`

`Command minh hoạ:`
```bash
[root@cloudvps1588 ~]# mkdir -p ~/.ssh
[root@cloudvps1588 ~]# nano ~/.ssh/authorized_keys
[root@cloudvps1588 ~]# chmod 700 ~/.ssh
[root@cloudvps1588 ~]# chmod 600 ~/.ssh/authorized_keys
```

3️⃣ Thêm `PRIVATE KEY` vào `GitHub Secrets` : ok. giờ là ở máy `local`

```bash
nguye@HOADEV MINGW64 /c/laragon/www/hoacode (main)
$ cat /c/Users/nguye/.ssh/id_ed25519
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBt6X5xlBaOhYZMoMxIxS0276E5uxdTyXcWFqvpNX9+cgAAAKCoqCapqKgm
qQAAAAtzc2gtZWQyNTUxOQAAACBt6X5xlBaOhYZMoMxIxS0276E5uxdTyXcWFqvpNX9+cg
AAAECJIjzTDNuh3VhC0JXlj84n4Fzsv/R6EM44nfV6bz1tEW3pfnGUFo6FhkygzEjFLTbv
oTm7F1PJdxYWq+k1f35yAAAAHWdpdGh1Yi1hY3Rpb25zQGRldm5pbmphLmlvLnZu
-----END OPENSSH PRIVATE KEY-----
```
Copy tất cả, bao gồm: mã key trên 🔹 Vào `GitHub`
```bash
Repo → Settings → Secrets and variables → Actions
```

➕ `Add secrets:`

SSH_PRIVATE_KEY :  nội dung private key 
VPS_HOST :  IP VPS (vd: 103.xxx.xxx.xxx) 
VPS_USER :  user deploy (vd: root hoặc deploy)


4️⃣ Test SSH từ local (rất nên làm)

```bash
ssh -i ~/.ssh/github_actions_ed25519 deploy@VPS_IP
```

~/.ssh/github_actions_ed25519 : Là private key
Nằm trên máy local (PC / laptop của bạn)
KHÔNG BAO GIỜ upload file này lên VPS
File này chính là file bạn đã tạo bằng ssh-keygen hồi nảy ở máy local

-----

**CÁCH TẢI TỪ LOCAL TÊN GIT ACTION -> VPS**

```bash
scp -i ~/.ssh/id_ed25519 README.md root@27.0.15.88:/var/www/html/devninja.io.vn/
```
----

CÀI DOCKER TRÊN VPS CENTOS 7
1. Gỡ cài đặt phiên bản cũ (nếu có)
Đảm bảo hệ thống sạch trước khi cài bản mới:

```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```
2. Cài đặt Docker Engine
Chạy các lệnh sau để thiết lập kho lưu trữ và cài đặt:
```bash
# Cài đặt các công cụ cần thiết
sudo yum install -y yum-utils

# Thêm kho lưu trữ chính thức của Docker
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Cài đặt Docker Engine và Docker Compose
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
3. Kích hoạt Docker Service
Sau khi cài đặt, Docker chưa tự chạy. Bạn cần bật nó lên:
```bash
# Khởi động Docker
sudo systemctl start docker

# Cho phép Docker tự khởi động cùng hệ thống
sudo systemctl enable docker
```

4. Cấp quyền cho User (Rất quan trọng)
Để GitHub Actions có thể chạy lệnh docker mà không cần sudo (tránh lỗi Permission denied), bạn phải thêm user (ví dụ: root hoặc user bạn dùng trong secrets) vào group docker:
```bash
# Thay 'your_username' bằng username bạn khai báo trong secrets.VPS_USER
sudo usermod -aG docker your_username
```
Lưu ý: Sau bước này, bạn nên ngắt kết nối SSH và đăng nhập lại để quyền mới có hiệu lực.

5. Kiểm tra kết quả
Bạn có thể kiểm tra xem Docker đã sẵn sàng chưa bằng lệnh:
```bash
docker --version
# Kết quả mong đợi: Docker version 27.x.x...
```
6. Kiểm tra Log của App
Có thể container chạy nhưng ứng dụng bên trong bị crash ngay lập tức do thiếu biến môi trường hoặc lỗi kết nối database.

Hãy xem log để biết app có thực sự chạy không:

```bash
docker logs -f hoacode-nodejs-app
```

--------------------
THÊM PORT TRÊN VPS
Một vài lưu ý nhỏ cho CentOS 7:
Firewall: CentOS 7 thường dùng firewalld. Nếu bạn chạy app ở cổng 3000, hãy nhớ mở port:
```bash
# Kiểm tra xem firewalld có đang chạy không
sudo systemctl status firewalld
# Nếu đang chạy, hãy mở port 3000
sudo firewall-cmd --permanent --add-port=3000/tcp
#hoặc
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent

sudo firewall-cmd --reload
```
Kernel: CentOS 7 có kernel khá cũ. Nếu gặp lỗi khi chạy Docker, hãy đảm bảo hệ thống đã được cập nhật bản mới nhất (sudo yum update).
Sau khi cài đặt xong các bước trên, bạn hãy quay lại GitHub và nhấn Re-run all jobs. Lần này lệnh docker login và docker pull sẽ chạy thành công trên VPS của bạn!

Cách kiểm tra nhanh trên VPS: Chạy lệnh này để xem port 3000 đang được lắng nghe bởi địa chỉ nào:

```bash
sudo netstat -tulpn | grep 3000
```
Nếu thấy 0.0.0.0:3000 hoặc :::3000 là đúng.

Nếu thấy 127.0.0.1:3000 thì bạn cần sửa lại code Node.js thành app.listen(3000, '0.0.0.0').

------------------------
CÀI ĐẶT POSGSQL TỪ DOCKER
```bash
docker run -d \
  --name postgres-prod \
  --restart always \
  -e POSTGRES_DB=hoadev_db \
  -e POSTGRES_USER=hoadev \
  -e POSTGRES_PASSWORD=hoadev123 \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:18-alpine
```

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

Login vào postgresql
```bash
docker exec -it postgres-prod psql -U hoadev -d hoadev_db
```

Example:
```bash
5ed2318e4262:/# psql -U hoadev -d hoadev_db
psql (18.1)
Type "help" for help.

hoadev_db=# ll
hoadev_db-# dt
hoadev_db-#
hoadev_db=#
```

----------------------------------
- name: Trigger frontend pipeline
              run: |
                curl -X POST \
                  -H "Authorization: token ${{ secrets.MY_PAT_TOKEN }}" \
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



