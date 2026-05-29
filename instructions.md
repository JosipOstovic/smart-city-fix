# SmartCityFix - Setup & Deployment Instructions

## 1. Push to GitHub

```bash
# Remove existing git history (this was a template repo)
rm -rf .git

# Initialize fresh repo
git init
git add -A
git commit -m "Initial commit: SmartCityFix city issue reporter"

# Create a new repo on GitHub (via browser or gh CLI)
# Then link it:
gh repo create your-username/smartcityfix --public --source=. --push

# Or manually:
git remote add origin https://github.com/your-username/smartcityfix.git
git branch -M main
git push -u origin main
```

## 2. Run Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (running locally)
- Google Maps API key (Maps JavaScript API + Geocoding API enabled)
- Cloudinary account (free tier works)

### Steps

```bash
# 1. Create the database
createdb smartcityfix
# If createdb is not found, use psql instead:
# psql -U postgres -c "CREATE DATABASE smartcityfix;"

# 2. Backend setup
cd backend
cp .env.example .env
# Edit .env with your actual values (see Environment Variables below)
npm install
npx knex migrate:latest
npx knex seed:run
npm run dev
# Backend runs on http://localhost:3001

# 3. Frontend setup (new terminal)
cd frontend
cp .env.example .env
# Edit .env with your actual values
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Environment Variables

#### backend/.env

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend port | 3001 |
| DATABASE_URL | PostgreSQL connection string | postgresql://user@localhost:5432/smartcityfix |
| JWT_SECRET | Secret for signing tokens (min 32 chars) | any-random-string-at-least-32-characters |
| JWT_EXPIRES_IN | Token expiration | 7d |
| GOOGLE_MAPS_API_KEY | Google Maps server key (for geocoding) | AIza... |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your-cloud-name |
| CLOUDINARY_API_KEY | Cloudinary API key | 123456789 |
| CLOUDINARY_API_SECRET | Cloudinary API secret | abc123... |
| CORS_ORIGIN | Frontend URL | http://localhost:5173 |

#### frontend/.env

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3001/api |
| VITE_GOOGLE_MAPS_API_KEY | Google Maps client key | AIza... |
| VITE_CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your-cloud-name |
| VITE_CLOUDINARY_UPLOAD_PRESET | Unsigned upload preset name | smartcityfix-unsigned |

### Google Maps API Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create an API key under Credentials
5. Restrict the key:
   - For frontend: restrict to HTTP referrers (your domain)
   - For backend: restrict to IP address (your server IP)

### Cloudinary Setup

1. Sign up at https://cloudinary.com (free tier)
2. Go to Settings > Upload
3. Add an upload preset:
   - Name: `smartcityfix-unsigned`
   - Signing Mode: Unsigned
   - Folder: `smartcityfix` (optional)
   - Max file size: 5MB

### Default Login Credentials

After running seeds:
- Admin: `admin@smartcityfix.hr` / `admin123`

## 3. Production Deployment

### Option A: VPS (DigitalOcean, Hetzner, etc.)

#### Server Setup

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres createuser --superuser your_user
sudo -u postgres createdb smartcityfix

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx as reverse proxy
sudo apt install -y nginx
```

#### Deploy Backend

```bash
cd backend
npm install --production
npx knex migrate:latest
npx knex seed:run  # Only first time

# Start with PM2
pm2 start src/server.js --name smartcityfix-api
pm2 save
pm2 startup
```

#### Deploy Frontend

```bash
cd frontend
npm install
npm run build
# Serve the dist/ folder with nginx
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (static files)
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then enable HTTPS with Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### Production .env (backend)

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/smartcityfix
JWT_SECRET=generate-a-strong-random-64-char-secret
JWT_EXPIRES_IN=7d
GOOGLE_MAPS_API_KEY=your-production-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

#### Production .env (frontend)

```env
VITE_API_URL=https://yourdomain.com/api
VITE_GOOGLE_MAPS_API_KEY=your-production-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloud
VITE_CLOUDINARY_UPLOAD_PRESET=smartcityfix-unsigned
```

### Option B: Railway / Render (PaaS)

#### Backend (Railway or Render)

1. Connect your GitHub repo
2. Set root directory to `backend`
3. Build command: `npm install && npx knex migrate:latest`
4. Start command: `node src/server.js`
5. Add a PostgreSQL addon
6. Set environment variables (DATABASE_URL is usually auto-set)

#### Frontend (Vercel or Netlify)

1. Connect your GitHub repo
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set environment variables
6. Add rewrite rule: `/* -> /index.html` (for SPA routing)

### Option C: Docker

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: smartcityfix
      POSTGRES_USER: smartcityfix
      POSTGRES_PASSWORD: your-db-password
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://smartcityfix:your-db-password@db:5432/smartcityfix
      JWT_SECRET: your-jwt-secret-min-32-chars
      JWT_EXPIRES_IN: 7d
      GOOGLE_MAPS_API_KEY: your-key
      CLOUDINARY_CLOUD_NAME: your-cloud
      CLOUDINARY_API_KEY: your-key
      CLOUDINARY_API_SECRET: your-secret
      CORS_ORIGIN: http://localhost:5173
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:80"

volumes:
  pgdata:
```

Create `backend/Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["sh", "-c", "npx knex migrate:latest && node src/server.js"]
```

Create `frontend/Dockerfile`:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

Run with: `docker-compose up -d`

## 4. Database Management

```bash
# Create a new migration
cd backend
npx knex migrate:make migration_name

# Run migrations
npx knex migrate:latest

# Rollback last batch
npx knex migrate:rollback

# Re-seed (deletes existing data!)
npx knex seed:run

# Connect to DB directly
psql smartcityfix
```

## 5. Promoting a User to Admin

```sql
-- Connect to your database
psql smartcityfix

-- Make a user an admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```
