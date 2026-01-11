**Deploy React/Next.js lên AWS S3 bằng GitHub Actions**

**Bước 1:**
- Tạo tài khoản aws

**Bước 2:** Khi đã tạo được tài khoản aws, chúng ta vào tạo EC2 Instance
- Mọi người có thể xem video trước đó mình chia sẻ tại đây

**Bước 3:** Chúng ta cần tạo một Bucket S3
https://us-east-1.console.aws.amazon.com/s3/buckets?region=us-east-1

-  Bấm vào **Create bucket**

- tại mục General configuration 
  + chọn General purpose
  + đặt tên name **Bucket name**

- tạiObject Ownership Info
Control ownership of objects written to this bucket from other AWS accounts and the use of access control lists (ACLs). Object ownership determines who can specify access to objects.

  + chọn - > **ACLs disabled (recommended)**
All objects in this bucket are owned by this account. Access to this bucket and its objects is specified using only policies.

- tại  - >**Block Public Access settings for this bucket**
  + hãy tích bỏ **Block all public access**

- Còn lại cứ để mặt định
- Sau đó bấm tạo -> **Create bucket**

**Bước 4:** Cấp quyền IAM cho GitHub Actions
Bạn phải tạo IAM User để GitHub Actions có thể upload lên S3.
https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/users
- IAM → Users → Create 
- Sau khi tạo user xong, hãy bấm vào user vừa tạo, tại mục **Permissions** chúng ta cần **Create inline policy**
  + Specify permissions Info
  + chọn Select a service
  + tìm kiếm **S3**, tìm kiếm tích chọn các quyền sau:
  ```bassh
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
  ```

  + Sau đó tại mục **Resources** , nó kêu bạn gắn tên bucket bạn vừa tạo ở trước 3 vào để có quyền làm việc,...chổ này tùy ý hoặc chọn any 
  + sau đó cứ bấm Next

**Bước 5:** Tiếp theo chúng ta cần có các 
```bash
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

- Mấy key trên chung ta vào mục **IAM** -> chọn user mà chúng ta vừa tạo ở bước trên
- sau khi chúng ta bấm vào user vừa tạo, chúng ta kéo xuống kiếm mục tab **Security credentials**
- sau đó tại mục **Security credentials** hãy tìm chổ **Access** keys** -> tiếp tục tại đó chúng ta chọn  **Create access key** 

- khi bấm vào mục create access key, sẽ hiện ra một bảng 
**Access key best practices & alternatives**
- Bạn hãy chọn ->  **Third-party service
You plan to use this access key to enable access for a third-party application or service that monitors or manages your AWS resources.**
- tiếp tục tích vào Confirmation
- sau đó bấm tạo là xong, nó sẽ cho ta các key và secret
- bạn hãy lưu các key này lại, để nửa tạo khóa bên github action,

**Bước 6:** Chúng ta chỉ cần up source lên github, sau đó cấu hình
```bash
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```
trong mục "Settings" của project
https://github.com/skipperhoa/react-nextjs-app-router-docker/settings

tại **Security** : hãy tìm chọn **Secrets and Variables**
và chọn **Actions**
https://github.com/skipperhoa/react-nextjs-app-router-docker/settings/secrets/actions
- Sau khi vào bên trong mục Actions: hãy tìm mục **Repository secrets** sao đó sẽ thấy nút tạo. chúng ta hãy tạo các key như dưới đậy, và hãy nhớ dán giá trị key, secret key mà ta đã tạo ở **BƯỚC 5**
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

chúng ta nên tạo thêm  key như:
AWS_S3_BUCKET : nó là tên của Bucket mà ta tạo ở **bước 3**
AWS_REGION : vị trí aws của chúng ta , bạn sẽ thấy nó ở rên url
```bash
https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/users
```
ví dụ : us-east-1
AWS_REGION : us-east-1

Bước 7 : chúng ta quay về source code của chúng ta
- tạo thư mục **.github/workflows**
- trong thư mục này , tiếp tục tạo file **deploy.yml**
Ví dụ : **.github/workflows/deploy.yml**
```bash
name: Deploy Next.js to S3

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]
# Cần permissions để dùng OIDC
permissions:
  id-token: write   # Tạo OIDC token
  contents: read    # Checkout code
jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

          # role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsDeploy  # Thay bằng ARN thật
          # aws-region: us-east-1
          # audience: sts.amazonaws.com

      - name: Deploy to S3
        run: aws s3 sync ./out s3://${{ secrets.AWS_S3_BUCKET }} --delete --cache-control "public, max-age=31536000, immutable" --exclude "*.html" --exclude "*.json"

      - name: Deploy HTML and JSON files to S3
        run: aws s3 sync ./out s3://${{ secrets.AWS_S3_BUCKET }} --delete --cache-control "public, max-age=0, must-revalidate" --exclude "*" --include "*.html" --include "*.json"
```

**Bước 8:** Chúng ta chỉ cần dùng câu lệnh git để push code lên github, nó tự chạy gitaction cho chúng ta

```bash
git add .
git commit -m "pust to code to aws s3"
git push origin develop
```

**Bước 9:**  Chúng ta quay lại github, chưa project của chúng ta
- Bấm vào mục **Pull request** để xác nhận có một request cần thao tác

https://github.com/skipperhoa/react-nextjs-app-router-docker/pulls

- Sao đó bạn bấm vào mục **Actions** để xem nó deploy nha
https://github.com/skipperhoa/react-nextjs-app-router-docker/actions

**Bước 10:** Nếu có lỗi xảy ra, thì chúng ta tính tiếp và mò sửa thôi kaka
