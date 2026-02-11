# AgroGuard AI - Deployment Guide

## Production Deployment

This guide covers deploying AgroGuard AI to production environments.

---

## Backend Deployment

### Prerequisites
- Python 3.8+
- Gunicorn (WSGI server)
- Nginx or Apache (reverse proxy)
- PostgreSQL (recommended for production) or SQLite

### Step 1: Prepare the Server

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Python and required packages
sudo apt-get install python3 python3-pip python3-venv -y

# Install Gunicorn
pip install gunicorn
```

### Step 2: Setup Virtual Environment

```bash
cd /var/www/agroguard-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Update Configuration

Edit `auth.py`:
```python
# Change from:
SECRET_KEY = "your-secret-key-change-in-production"

# To:
SECRET_KEY = "your-random-secret-key-from-os-urandom"
```

Update CORS in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Create Systemd Service

Create `/etc/systemd/system/agroguard.service`:

```ini
[Unit]
Description=AgroGuard AI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/agroguard-backend
Environment="PATH=/var/www/agroguard-backend/venv/bin"
ExecStart=/var/www/agroguard-backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 main:app

[Install]
WantedBy=multi-user.target
```

### Step 5: Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable agroguard
sudo systemctl start agroguard
sudo systemctl status agroguard
```

### Step 6: Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/agroguard`:

```nginx
upstream agroguard_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    client_max_body_size 50M;

    location / {
        proxy_pass http://agroguard_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/agroguard-backend/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/agroguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d api.yourdomain.com
```

---

## Frontend Deployment

### Option 1: Netlify (Recommended for beginners)

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Connect GitHub repository to Netlify**

3. **Configure Netlify settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL=https://api.yourdomain.com`

4. **Deploy**
   - Push to GitHub, Netlify auto-deploys

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure environment variables in Vercel dashboard**

### Option 3: Traditional Web Server (Nginx)

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload `dist` folder to server**

3. **Configure Nginx**

Create `/etc/nginx/sites-available/agroguard-frontend`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/agroguard-frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Route all requests to index.html for SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/agroguard-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Database Setup for Production

### Using PostgreSQL

1. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib -y
   ```

2. **Create database and user**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE agroguard;
   CREATE USER agroguard WITH PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE agroguard TO agroguard;
   \q
   ```

3. **Update connection in `main.py`** (if migrating from SQLite)
   ```python
   DATABASE_URL = "postgresql://agroguard:password@localhost/agroguard"
   ```

### Backup Strategy

Daily backup script:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/agroguard"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
sqlite3 /var/www/agroguard-backend/agroguard.db ".dump" > $BACKUP_DIR/db_$DATE.sql

# Backup uploaded files
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/agroguard-backend/static/uploads/

# Keep only last 30 days of backups
find $BACKUP_DIR -type f -mtime +30 -delete
```

Add to crontab:
```bash
0 0 * * * /usr/local/bin/backup-agroguard.sh
```

---

## Security Checklist

- [ ] Change SECRET_KEY to a random value
- [ ] Update CORS origins to your domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure cookies (HttpOnly, Secure)
- [ ] Enable HSTS headers
- [ ] Rate limiting on authentication endpoints
- [ ] Regular backups
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Disable debug mode in production
- [ ] Setup firewall rules
- [ ] Enable logging and monitoring
- [ ] Use strong database passwords

---

## Monitoring and Logging

### Application Logs

```bash
# View Gunicorn logs
sudo journalctl -u agroguard -n 100 -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Setup Log Rotation

Create `/etc/logrotate.d/agroguard`:

```
/var/www/agroguard-backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl restart agroguard
    endscript
}
```

### Monitoring Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry, Rollbar
- **Server Monitoring**: Netdata, Prometheus

---

## Performance Optimization

### Backend

1. **Enable Caching**
   ```bash
   pip install redis
   ```

2. **Use Connection Pooling**
   - Configure database connection pooling

3. **Optimize Database Queries**
   - Add indexes to frequently queried columns
   - Use query optimization

4. **Enable Gzip Compression**
   - Already configured in Nginx examples above

### Frontend

1. **Code Splitting**
   - Already handled by Vite

2. **Image Optimization**
   - Convert to WebP format
   - Compress images

3. **CDN Setup**
   - Use Cloudflare for CDN
   - Cache static assets at edge locations

---

## Scaling Strategy

### Horizontal Scaling

1. **Load Balancing**
   ```nginx
   upstream backend {
       server backend1.yourdomain.com;
       server backend2.yourdomain.com;
       server backend3.yourdomain.com;
   }
   ```

2. **Database Replication**
   - Setup PostgreSQL master-slave replication
   - Use read replicas for queries

3. **Microservices**
   - Separate prediction service
   - Separate report generation service

### Vertical Scaling

- Increase server RAM
- Upgrade CPU
- Use SSDs for better I/O

---

## Rollback Procedure

```bash
# Backup current version
cp -r /var/www/agroguard-backend /var/www/agroguard-backend.backup

# Rollback
git checkout v1.0.0
pip install -r requirements.txt
systemctl restart agroguard
```

---

## Post-Deployment Testing

1. **Health Check**
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. **API Test**
   ```bash
   curl https://api.yourdomain.com/docs
   ```

3. **Frontend Test**
   - Open https://yourdomain.com in browser
   - Test all pages
   - Test authentication flow
   - Test image upload and prediction

4. **Performance Test**
   ```bash
   ab -n 100 -c 10 https://api.yourdomain.com/
   ```

---

## Troubleshooting

### Application won't start
- Check logs: `journalctl -u agroguard -n 50`
- Verify dependencies: `pip install -r requirements.txt`
- Check port availability: `netstat -tlnp | grep 8000`

### Slow performance
- Check database indexes
- Monitor server resources
- Check Nginx error logs
- Enable query logging

### Database errors
- Check database connection
- Verify credentials
- Check disk space
- Monitor database processes

---

## Support and Maintenance

- **Regular Updates**: Keep dependencies updated monthly
- **Security Patches**: Apply immediately
- **Monitoring**: Setup alerts for errors
- **Documentation**: Maintain deployment docs
- **Testing**: Perform regular load tests
