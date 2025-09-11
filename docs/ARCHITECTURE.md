# Abbrevio Architecture

## Overview

Abbrevio je moderna web aplikacija sastavljena od tri glavna dijela:
- **Frontend**: Angular 18+ SPA aplikacija
- **Backend**: Laravel 11 REST API
- **ML Service**: Python Flask mikroservis za machine learning

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Angular SPA   │────▶│   Laravel API   │────▶│     MySQL       │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
          │                       │
          │                       │
          │               ┌─────────────────┐
          │               │                 │
          └──────────────▶│  Python Flask   │
                          │  (ML Service)   │
                          │                 │
                          └─────────────────┘
```

## Frontend (Angular)

### Komponente:
- **SearchComponent**: Glavna komponenta za pretraživanje
- **AbbreviationDetailComponent**: Prikaz detalja kratice
- **AddAbbreviationComponent**: Forma za dodavanje nove kratice
- **UserDashboardComponent**: Korisnički dashboard
- **AuthComponent**: Autentifikacija

### Servisi:
- **AbbreviationService**: Komunikacija sa backend API-jem
- **AuthService**: Upravljanje autentifikacijom
- **MLService**: Komunikacija sa ML servisom
- **NotificationService**: Notifikacije za korisnika

### Ključne značajke:
- TypeScript za type safety
- RxJS za reactive programming
- Angular Material za UI komponente
- Lazy loading za optimizaciju performansi

## Backend (Laravel)

### Struktura:
```
backend/
├── app/
│   ├── Http/Controllers/     # API kontroleri
│   ├── Models/              # Eloquent modeli
│   ├── Services/            # Business logika
│   ├── Requests/            # Validacija zahtjeva
│   └── Policies/            # Autorizacija
├── database/
│   ├── migrations/          # Database shema
│   └── seeders/            # Test podaci
└── routes/
    └── api.php             # API rute
```

### Ključni modeli:
- **User**: Korisnici sistema
- **Abbreviation**: Kratice
- **Vote**: Glasovi korisnika
- **Comment**: Komentari
- **UserInteraction**: Praćenje korisničkih interakcija

### API Endpoints:
```
POST   /api/auth/login          # Prijava
POST   /api/auth/register       # Registracija
GET    /api/abbreviations       # Lista kratica
POST   /api/abbreviations       # Nova kratica
GET    /api/abbreviations/{id}  # Detalji kratice
POST   /api/abbreviations/{id}/vote     # Glasanje
POST   /api/abbreviations/{id}/comments # Komentiranje
```

## ML Service (Python Flask)

### Funkcionalnosti:
- **Personalizacija**: Preporučuje kratice na osnovu korisničkih preferencija
- **Clustering**: Grupiranje sličnih kratica
- **Sentiment Analysis**: Analiza komentara
- **Trend Analysis**: Analiza trendova korištenja

### ML Algoritmi:
- **Collaborative Filtering**: Za preporučke
- **TF-IDF**: Za search relevance
- **Random Forest**: Za klasifikaciju
- **K-Means**: Za clustering

### API Endpoints:
```
GET  /recommendations/{user_id}  # Personalizirane preporučke
POST /train                      # Treniranje modela
POST /track-interaction          # Praćenje interakcija
POST /similar-abbreviations      # Pronalaženje sličnih kratica
```

## Database Schema

### Osnovne tabele:
```sql
users
├── id (PK)
├── name
├── email (unique)
├── department
├── role
└── timestamps

abbreviations
├── id (PK)
├── abbreviation
├── meaning
├── description
├── department
├── category
├── user_id (FK)
└── timestamps

votes
├── id (PK)
├── user_id (FK)
├── abbreviation_id (FK)
├── type (up/down)
└── timestamps

comments
├── id (PK)
├── user_id (FK)
├── abbreviation_id (FK)
├── content
└── timestamps

user_interactions
├── id (PK)
├── user_id (FK)
├── abbreviation_id (FK)
├── interaction_type
├── metadata (JSON)
└── timestamps
```

## Security

### Authentication:
- JWT tokeni za API pristup
- Bcrypt za hashiranje lozinki
- Rate limiting za API zaštitu

### Authorization:
- Role-based access control (RBAC)
- Laravel Policies za fine-grained kontrolu
- CORS konfiguracija

### Data Protection:
- Input validacija i sanitizacija
- SQL injection zaštita
- XSS zaštita

## Performance

### Caching:
- Redis za session storage
- Database query caching
- API response caching

### Optimizacije:
- Database indexi na często korištenim poljima
- Lazy loading u Angular aplikaciji
- API pagination
- Image optimization

### Monitoring:
- Application logging
- Performance metrics
- Error tracking

## Deployment

### Docker:
- Multi-container setup
- Separate containers za svaki servis
- Volume mounting za persistence

### Production:
- Nginx reverse proxy
- SSL/TLS encryption
- Database backup strategy
- Auto-scaling capabilities

## Future Enhancements

### Planove funkcionalnosti:
- Real-time notifications
- Advanced analytics dashboard
- Mobile aplikacija
- API rate limiting po korisniku
- Advanced search sa Elasticsearch
- Multi-language support
