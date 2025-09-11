# Abbrevio Setup Guide

## Quick Start sa Docker-om

Najbrži način pokretanja cijele aplikacije:

```bash
# 1. Kloniraj repozitorij
git clone <repository-url>
cd abbrevio

# 2. Pokreni sve servise
docker-compose up -d

# 3. Pristup aplikaciji
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
# ML Service: http://localhost:5000
```

## Manualano postavljanje

### 1. Backend (Laravel)

```bash
cd backend

# Instaliraj dependencies
composer install

# Kopiraj environment file
cp .env.example .env

# Generiraj application key
php artisan key:generate

# Pokreni migracije (osiguraj se da MySQL radi)
php artisan migrate --seed

# Pokreni server
php artisan serve
```

### 2. Frontend (Angular)

```bash
cd frontend

# Instaliraj dependencies
npm install

# Pokreni development server
ng serve

# Ili
npm start
```

### 3. ML Service (Python)

```bash
cd ml-service

# Instaliraj Python dependencies
pip install -r requirements.txt

# Pokreni Flask server
python app.py
```

### 4. Database (MySQL)

Kreiraj MySQL bazu podataka:

```sql
CREATE DATABASE abbrevio;
CREATE USER 'abbrevio_user'@'localhost' IDENTIFIED BY 'abbrevio_password';
GRANT ALL PRIVILEGES ON abbrevio.* TO 'abbrevio_user'@'localhost';
FLUSH PRIVILEGES;
```

## Environment Variables

### Backend (.env)
```
APP_NAME=Abbrevio
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=abbrevio
DB_USERNAME=abbrevio_user
DB_PASSWORD=abbrevio_password
JWT_SECRET=your-secret-key
EXTERNAL_API_URL=https://api.abbreviations.com
ML_SERVICE_URL=http://localhost:5000
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  mlServiceUrl: 'http://localhost:5000'
};
```

## Testiranje

```bash
# Frontend testovi
cd frontend
npm test

# Backend testovi
cd backend
php artisan test

# ML Service testovi
cd ml-service
python -m pytest
```

## Production Deployment

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Ručno deployment
1. Postavi HTTPS
2. Konfiguruje production database
3. Optimiziraj Angular build
4. Postavi reverse proxy (nginx)
5. Postavi SSL certifikate

## Troubleshooting

### Česti problemi:

1. **Port zauzet**
   ```bash
   # Provjeri koji proces koristi port
   lsof -i :8000
   # Zaustavi process ili promijeni port
   ```

2. **Database connection error**
   - Provjeri da li MySQL radi
   - Provjeri database credentials u .env

3. **CORS errors**
   - Provjeri backend CORS konfiguraciju
   - Provjeri frontend API URL

4. **ML Service not responding**
   - Provjeri Python dependencies
   - Provjeri da li Flask radi na portu 5000

## Performance Optimizacija

1. **Database indexi**
2. **Redis caching**
3. **CDN za static assets**
4. **API rate limiting**
5. **Database query optimization**
