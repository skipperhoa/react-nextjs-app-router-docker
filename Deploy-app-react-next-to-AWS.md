**Tạo LaunchInstances**
1. chúng ta cần đăng ký một tài khoản AWS
2. sau khi đăng ký xong, ta cần tạo một -> **LaunchInstances** 
   + Trong Instances
   Name and tags   : đặt tên cho Instances
   Application and OS Images (Amazon Machine Image) :  chọn hệ điều hành Ubuntu
   Key pair (login)  Info : chúng ta nên tạo một key pair, để đăng nhập vào root SSH
   Network settings  Info : 
		+ chọn create security group - > tích chọn Allow SSH traffic from
		+ Kế bên có chổ chọn ip, ta select chọn Anywhere hoặc tùy nhu cầu 

		
3. Cuối cùng là bấm Launch instance , để nó tạo là xong

---------------------------
Đăng nhập SSH vào AWS LaunchInstances
Instance ID
i-0072d7ef40910b76a
Open an SSH client.

Locate your private key file. The key used to launch this instance is hoadev-test-app.pem

Run this command, if necessary, to ensure your key is not publicly viewable.
chmod 400 "hoadev-test-app.pem"

Connect to your instance using its Public DNS:
ec2-44-201-72-241.compute-1.amazonaws.com

Example:
```bash
ssh -i "hoadev-test.pem" ubuntu@ec2-44-201-72-241.compute-1.amazonaws.com
```
Demo connect:
```bash
hoacode@HoaCodes-MacBook-Pro Downloads % cp hoadev-test-app.pem ~/.ssh
hoacode@HoaCodes-MacBook-Pro Downloads % cd ~/.ssh
hoacode@HoaCodes-MacBook-Pro .ssh % 
hoacode@HoaCodes-MacBook-Pro .ssh % chmod 400 "hoadev-test-app.pem"
hoacode@HoaCodes-MacBook-Pro .ssh % ssh -i "hoadev-test-app.pem" ubuntu@ec2-44-201-72-241.compute-1.amazonaws.com
```
----------------------------------

**Tiếp tục ta sẽ upload source lên Instances để chạy thôi**

**Setup EC2 Instance**

```bash
sudo apt update
sudo apt upgrade
```

*** Install Node.js***
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

***rsync***
Dùng để kéo source từ local đến vps , chú ý chổ your-key, là key bạn vừa tạo khi thiếp lập LaunchInstances lúc đầu

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/.ssh/your-key.pem" \
. ubuntu@ip-address:~/app

```

Example:
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i  ~/hoadev-test.pem" \
.  ubuntu@ec2-44-201-72-241.compute-1.amazonaws.com:~/project/react-next-app
```

***Database***


POSGRESQL

```bash
ubuntu@ip-172-31-76-249: sudo apt install postgresql postgresql-contrib

ubuntu@ip-172-31-76-249: sudo systemctl start postgresql
ubuntu@ip-172-31-76-249: sudo systemctl enable postgresql

ubuntu@ip-172-31-76-249:~/project/app$ sudo -i -u postgres
postgres@ip-172-31-76-249:~$ createuser --interactive
Enter name of role to add: hoanguyen
Shall the new role be a superuser? (y/n) y
postgres@ip-172-31-76-249:~$ createdb hoanguyen_db

postgres@ip-172-31-76-249:~$ psql
postgres-# \password hoanguyen

postgres-# GRANT ALL PRIVILEGES ON DATABASE hoadev_db TO hoadev;
postgres-# GRANT ALL ON SCHEMA public TO hoanguyen;
postgres-# GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hoadev;
postgres-# GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hoadev;

```

***systemd***
Step 1: Create the Environment File
Create a new file for your environment variables and open the file in Vim:
```bash
sudo vim /etc/app.env
```

In Vim, add your variables in the format VARIABLE=value. For example:
```bash
DB_PASSWORD=your_secure_password
```
Chú ý :
to save and exit vim, press esc then :wq then enter

Restrict the file permissions for security.
```bash
sudo chmod 600 /etc/app.env
sudo chown ubuntu:ubuntu /etc/app.env
```

Step 2: Create the systemd Service File
Navigate to the systemd directory and create a new service file, myapp.service.

```bash
sudo vim /etc/systemd/system/myapp.service
```

Define the service settings. Add the following content in Vim, modifying as needed for your application:

```bash
[Unit]
Description=Next.js App
After=network.target multi-user.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/project/app
ExecStart=/usr/bin/npm run dev
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=/etc/app.env
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
```
Reload systemd and start your service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp.service
sudo systemctl start myapp.service
```

Verify that the service is running properly.

```bash
sudo systemctl status myapp.service
```

***View Logs***
```bash
sudo journalctl -u myapp.service
```
tail logs:

```bash
sudo journalctl -fu myapp.service
```

***Caddy***
Step 1: Install Caddy
https://caddyserver.com/docs/install

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

mở file cấu hình caddyfile 

```bash
sudo vim /etc/caddy/Caddyfile
:80 {
    reverse_proxy localhost:3000
}
sudo systemctl restart caddy
```

Step 2: Configure Caddy to Use HTTPS
Add a domain name for your server.

Update the Caddyfile to use your domain name and enable HTTPS.

sudo vim /etc/caddy/Caddyfile
mydomain.com {
    reverse_proxy localhost:3000
}
sudo systemctl restart caddy

-------------------------

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```