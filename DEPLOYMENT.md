# Paytm GrowthOS — Production Deployment & Cloud Architecture Guide

> **Tagline**: *"From payment data to the next best action."*  
> **Positioning**: Closed-loop AI Growth Engine for Paytm Merchants  
> **Operating Loop**: `OBSERVE → DETECT → REASON → RECOMMEND → GET MERCHANT APPROVAL → EXECUTE → MEASURE → LEARN`

---

## Architecture Overview

Paytm GrowthOS is architected as an enterprise, decoupled full-stack application:

1. **Frontend**: Next.js 14 (React 18, TypeScript, Tailwind CSS, Lucide icons, Recharts) with client-side audio chimes and native Hindi (`hi`), Marathi (`mr`), and English (`en`) localization.
2. **Backend**: FastAPI (Python 3.9+) with SQLAlchemy ORM, Deterministic Policy Engine, Action Governor (SHA-256 Idempotency), Cannibalization Engine, and Integration Adapters.
3. **Database**: 
   - **Local / Edge**: SQLite (`growthos.db`)
   - **Production / Enterprise**: PostgreSQL 15+ (partitioned schema via `backend/scripts/migrations_postgres.sql`)

---

## Option 1: Quick Deployment via Docker Compose (Recommended)

Run both the Next.js frontend and FastAPI backend with a single command:

### Prerequisites
- Docker (v20+) & Docker Compose (v2.0+)

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/<your-username>/growthos.git
cd growthos
cp .env.example .env
```

### Step 2: Build and Run
```bash
docker compose up --build -d
```

### Step 3: Verify Services
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: `curl -f http://localhost:8000/health`

To stop the containers:
```bash
docker compose down
```

---

## Option 2: Cloud Deployment (Vercel + Render / Railway)

### A. Deploy Backend to Render or Railway
1. **Repository**: Link your GitHub repository.
2. **Root Directory**: Select `backend`.
3. **Environment**: Python 3.9+
4. **Build Command**:
   ```bash
   pip install -r requirements.txt && python scripts/seed_demo_data.py
   ```
5. **Start Command**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. **Environment Variables**:
   - `ENVIRONMENT`: `production`
   - `DATABASE_URL`: `sqlite:///growthos.db` (or your managed PostgreSQL connection string: `postgresql://user:password@host:port/dbname`)
   - `PROJECT_NAME`: `Paytm GrowthOS`
   - `CORS_ORIGINS`: `https://your-frontend-domain.vercel.app,http://localhost:3000`

### B. Deploy Frontend to Vercel
1. **Repository**: Import your GitHub repository into Vercel.
2. **Root Directory**: Select `frontend`.
3. **Framework Preset**: `Next.js`
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`
6. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-service.onrender.com` (your deployed backend URL)
7. Click **Deploy**. Vercel will build and assign your production domain.

---

## Option 3: VPS Deployment (Ubuntu 22.04 / Debian)

For production deployment on an AWS EC2, GCP Compute Engine, or DigitalOcean Droplet with Nginx and Systemd:

### 1. Install System Dependencies
```bash
sudo apt update && sudo apt install -y python3-pip python3-venv nodejs npm nginx git
sudo npm install -g n && sudo n 20
```

### 2. Setup Backend Systemd Service
Create virtual environment and install packages:
```bash
cd /var/www/growthos/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/seed_demo_data.py
```

Create `/etc/systemd/system/growthos-backend.service`:
```ini
[Unit]
Description=Paytm GrowthOS FastAPI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/growthos/backend
ExecStart=/var/www/growthos/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
Environment="ENVIRONMENT=production"
Environment="DATABASE_URL=sqlite:////var/www/growthos/backend/growthos.db"

[Install]
WantedBy=multi-user.target
```
Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable growthos-backend
sudo systemctl start growthos-backend
```

### 3. Setup Frontend Production Server
```bash
cd /var/www/growthos/frontend
npm ci
NEXT_PUBLIC_API_URL=https://api.yourdomain.com npm run build
```

Create `/etc/systemd/system/growthos-frontend.service`:
```ini
[Unit]
Description=Paytm GrowthOS Next.js Frontend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/growthos/frontend
ExecStart=/usr/bin/npm run start -- -p 3000
Restart=always
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```
Enable and start frontend:
```bash
sudo systemctl daemon-reload
sudo systemctl enable growthos-frontend
sudo systemctl start growthos-frontend
```

### 4. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/growthos`:
```nginx
# Frontend
server {
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/growthos /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

---

## Running Automated Tests

Run backend unit tests and enterprise compliance test suite:
```bash
cd backend
source venv/bin/activate # (or .\venv\Scripts\activate on Windows)
pytest -v tests/
```
All 27 test cases will execute:
- Deterministic Policy Engine (loan & revenue guarantee blocks)
- Overlap Deduplication (Gross ₹7,400 vs Addressable ₹6,128)
- Action Governor & SHA-256 Idempotency
- DPDP Consent Center API
- Multilingual Natural Goal Decomposer

---

## Environment Variables Reference

| Variable | Scope | Description | Default |
| :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Backend | Application environment (`development` / `production`) | `production` |
| `DATABASE_URL` | Backend | Database connection URL (SQLite or PostgreSQL) | `sqlite:///growthos.db` |
| `CORS_ORIGINS` | Backend | Allowed frontend origins for CORS | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API endpoint URL | `http://localhost:8000` |
| `PAYTM_MERCHANT_ID` | Backend | Test or production Paytm MID | `PYTM98421049` |
