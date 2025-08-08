# 🖥️ 服务器部署操作指南

## 📋 **部署前准备**

### 服务器要求（最低配置）

- **CPU**: 1核心
- **内存**: 512MB（推荐1GB）
- **存储**: 10GB可用空间
- **系统**: Ubuntu 18.04+/Debian 9+/CentOS 7+

### 网络要求

- 能够访问互联网（下载Docker镜像）
- 开放端口：22(SSH)、80(HTTP)、443(HTTPS)、4873(Verdaccio)

## 🚀 **一键部署（推荐）**

### 方法1: 使用安装脚本

```bash
# 1. 登录到您的服务器
ssh your_username@your_server_ip

# 2. 下载并运行安装脚本
curl -fsSL https://raw.githubusercontent.com/your-repo/jr-fe-common/main/scripts/server-install.sh | bash

# 或者如果您有项目文件
wget https://raw.githubusercontent.com/your-repo/jr-fe-common/main/scripts/server-install.sh
chmod +x server-install.sh
./server-install.sh
```

## 🛠️ **手动部署步骤**

### 1. 连接到服务器

```bash
ssh your_username@your_server_ip
```

### 2. 检查环境

```bash
# 下载环境检查脚本
wget https://raw.githubusercontent.com/your-repo/jr-fe-common/main/scripts/server-check.sh
chmod +x server-check.sh
./server-check.sh
```

### 3. 安装Docker（如果未安装）

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 重新登录以使组权限生效
exit
ssh your_username@your_server_ip
```

### 4. 安装Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 5. 创建项目目录

```bash
sudo mkdir -p /opt/jr-npm-registry
sudo chown -R $USER:$USER /opt/jr-npm-registry
cd /opt/jr-npm-registry
```

### 6. 上传配置文件

```bash
# 方法1: 从Git仓库拉取
git clone https://github.com/your-repo/jr-fe-common.git .

# 方法2: 手动上传（使用scp）
# 在本地执行：
# scp -r docker-compose.yml verdaccio/ nginx/ your_username@your_server_ip:/opt/jr-npm-registry/
```

### 7. 设置权限

```bash
mkdir -p verdaccio/storage/data verdaccio/plugins nginx/ssl
sudo chown -R 10001:65533 verdaccio/storage verdaccio/plugins
```

### 8. 配置防火墙

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 4873
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=4873/tcp
sudo firewall-cmd --reload
```

### 9. 启动服务

```bash
docker-compose up -d
```

### 10. 验证部署

```bash
# 检查服务状态
docker-compose ps

# 查看日志
docker-compose logs -f verdaccio

# 测试访问
curl http://localhost:4873
```

## 🌐 **访问配置**

### 获取服务器公网IP

```bash
curl ifconfig.me
```

### 浏览器访问

- **直接访问**: `http://your_server_ip:4873`
- **通过Nginx**: `http://your_server_ip` (如果配置了Nginx)

## 🔧 **常用管理命令**

### 服务管理

```bash
cd /opt/jr-npm-registry

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新镜像
docker-compose pull
docker-compose up -d
```

### 数据备份

```bash
# 备份存储数据
sudo tar -czf verdaccio-backup-$(date +%Y%m%d).tar.gz verdaccio/storage/

# 恢复数据
sudo tar -xzf verdaccio-backup-YYYYMMDD.tar.gz
```

## 📱 **客户端配置**

### 配置npm registry

```bash
# 设置私有仓库
npm config set registry http://your_server_ip:4873

# 或者使用域名（如果配置了）
npm config set registry http://npm.yourcompany.com
```

### 创建用户账号

```bash
npm adduser --registry http://your_server_ip:4873
```

### 发布包

```bash
npm publish --registry http://your_server_ip:4873
```

## 🛡️ **安全配置**

### 1. 配置SSL证书（推荐）

```bash
# 使用Let's Encrypt免费证书
sudo apt install certbot

# 获取证书
sudo certbot certonly --standalone -d npm.yourcompany.com

# 将证书复制到nginx目录
sudo cp /etc/letsencrypt/live/npm.yourcompany.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/npm.yourcompany.com/privkey.pem nginx/ssl/key.pem

# 更新nginx配置启用HTTPS
# 编辑 nginx/nginx.conf，取消HTTPS配置的注释

# 重启nginx
docker-compose restart nginx
```

### 2. 配置域名

```bash
# 编辑nginx配置
nano nginx/nginx.conf

# 修改 server_name
server_name npm.yourcompany.com;

# 重启服务
docker-compose restart nginx
```

### 3. 限制访问（可选）

```bash
# 只允许特定IP访问
sudo ufw deny 4873
sudo ufw allow from YOUR_OFFICE_IP to any port 4873
```

## 🔍 **故障排除**

### 常见问题

1. **端口被占用**

   ```bash
   sudo netstat -tulpn | grep :4873
   sudo lsof -i :4873
   ```

2. **权限问题**

   ```bash
   sudo chown -R 10001:65533 verdaccio/storage
   sudo chmod -R 755 verdaccio/storage
   ```

3. **内存不足**

   ```bash
   # 检查内存使用
   free -h

   # 添加swap分区
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

4. **网络问题**

   ```bash
   # 检查防火墙
   sudo ufw status

   # 检查Docker网络
   docker network ls
   docker-compose logs nginx
   ```

### 监控和日志

```bash
# 实时监控资源使用
htop

# 查看系统日志
sudo journalctl -u docker

# 查看应用日志
docker-compose logs --tail=100 -f
```

## 📞 **技术支持**

如果遇到问题，可以：

1. 查看日志文件进行诊断
2. 检查防火墙和网络配置
3. 确认服务器资源是否充足
4. 参考官方文档：[Verdaccio Documentation](https://verdaccio.org/docs/)

---

_部署完成后，您就拥有了一个功能完整的私有NPM仓库！_ 🎉
