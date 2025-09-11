# Abbrevio API Documentation

## Overview
Abbrevio is a web application for managing organizational abbreviations with voting, commenting, and machine learning-powered personalization features.

## Base URL
```
http://localhost:8000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "IT"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Abbreviations

#### GET /abbreviations
Get all abbreviations with pagination and filtering.

**Query Parameters:**
- `search` (string): Search term
- `department` (string): Filter by department
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "abbreviation": "API",
      "meaning": "Application Programming Interface",
      "description": "A set of protocols and tools for building software applications",
      "department": "IT",
      "category": "Technology",
      "votes_count": 15,
      "user": {
        "id": 1,
        "name": "John Doe"
      },
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 50,
    "last_page": 3
  }
}
```

#### POST /abbreviations
Create a new abbreviation.

**Request Body:**
```json
{
  "abbreviation": "API",
  "meaning": "Application Programming Interface",
  "description": "A set of protocols and tools for building software applications",
  "department": "IT",
  "category": "Technology",
  "get_suggestions": true
}
```

**Response:**
```json
{
  "message": "Abbreviation created successfully",
  "abbreviation": {
    "id": 1,
    "abbreviation": "API",
    "meaning": "Application Programming Interface",
    "description": "A set of protocols and tools for building software applications",
    "department": "IT",
    "category": "Technology",
    "suggested_meanings": ["Application Program Interface", "Advanced Programming Interface"],
    "user_id": 1,
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

#### GET /abbreviations/{id}
Get a specific abbreviation.

**Response:**
```json
{
  "id": 1,
  "abbreviation": "API",
  "meaning": "Application Programming Interface",
  "description": "A set of protocols and tools for building software applications",
  "department": "IT",
  "category": "Technology",
  "user": {
    "id": 1,
    "name": "John Doe"
  },
  "votes": [
    {
      "id": 1,
      "type": "up",
      "user": {
        "id": 2,
        "name": "Jane Smith"
      }
    }
  ],
  "comments": [
    {
      "id": 1,
      "content": "Very helpful explanation!",
      "user": {
        "id": 3,
        "name": "Bob Johnson"
      },
      "created_at": "2024-01-01T13:00:00Z"
    }
  ]
}
```

#### PUT /abbreviations/{id}
Update an abbreviation (only by creator or admin).

**Request Body:**
```json
{
  "meaning": "Updated meaning",
  "description": "Updated description"
}
```

#### DELETE /abbreviations/{id}
Delete an abbreviation (only by creator or admin).

#### POST /abbreviations/{id}/vote
Vote on an abbreviation.

**Request Body:**
```json
{
  "type": "up"  // or "down"
}
```

**Response:**
```json
{
  "message": "Vote added",
  "votes": 16
}
```

#### POST /abbreviations/{id}/comments
Add a comment to an abbreviation.

**Request Body:**
```json
{
  "content": "This is a helpful explanation!"
}
```

#### GET /abbreviations/suggestions
Get suggestions for an abbreviation from external API.

**Query Parameters:**
- `abbreviation` (string, required): The abbreviation to get suggestions for

**Response:**
```json
{
  "suggestions": [
    "Application Programming Interface",
    "Advanced Programming Interface",
    "Application Program Interface"
  ]
}
```

### Export

#### POST /export/pdf
Export selected abbreviations to PDF.

**Request Body:**
```json
{
  "abbreviation_ids": [1, 2, 3, 4, 5]
}
```

**Response:**
Binary PDF file download.

### Machine Learning

#### GET /ml/recommendations
Get personalized recommendations for the authenticated user.

**Response:**
```json
{
  "recommendations": [
    {
      "id": 5,
      "abbreviation": "ML",
      "meaning": "Machine Learning",
      "score": 0.95
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting
API requests are limited to 60 requests per minute per user.

## Pagination
List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
