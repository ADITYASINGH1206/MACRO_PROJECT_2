# API Reference

Complete documentation of all API endpoints available in the attendance system.

## Base URL

```
http://localhost:5000  (development)
https://your-api.com   (production)
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token from login endpoint and store in localStorage.

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc..."
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student"
  }
}
```

### Verify Token
```
POST /auth/verify
Authorization: Bearer <token>

Response:
{
  "valid": true,
  "user": { ... }
}
```

---

## Student Endpoints

### Get All Students
```
GET /students
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "roll_number": "CS001",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "department": "Computer Science"
    }
  ]
}
```

### Get Student by ID
```
GET /students/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { ... }
}
```

### Create Student
```
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "roll_number": "CS001",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "phone": "9876543210",
  "department": "Computer Science"
}

Response:
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

### Update Student
```
PUT /students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### Delete Student
```
DELETE /students/:id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Student deleted"
}
```

---

## Attendance Endpoints

### Mark Attendance
```
POST /attendance/mark
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- image: <binary image file>
- course_id: "uuid"
- date: "2024-01-15"

Response:
{
  "success": true,
  "data": {
    "marked": 5,
    "skipped": 0,
    "records": [
      {
        "student_id": "uuid",
        "confidence": 0.95,
        "status": "present"
      }
    ]
  }
}
```

### Get Attendance Records
```
GET /attendance/records/:course_id?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "course_id": "uuid",
      "date": "2024-01-15",
      "time": "2024-01-15T09:00:00Z",
      "status": "present",
      "confidence": 0.95
    }
  ]
}
```

### Get Attendance Summary
```
GET /attendance/summary/:course_id
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "total_classes": 20,
    "course_id": "uuid",
    "students": [
      {
        "student_id": "uuid",
        "name": "Alice Smith",
        "total_present": 18,
        "total_absent": 2,
        "percentage": 90
      }
    ]
  }
}
```

---

## Detection Endpoints

### Detect Faces in Image
```
POST /detection/detect
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
- image: <binary image file>

Response:
{
  "success": true,
  "detections": [
    {
      "confidence": 0.95,
      "bbox": [100, 100, 150, 200],
      "class": "face"
    }
  ],
  "count": 1
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

### Common Errors

```
{
  "success": false,
  "message": "Invalid credentials",
  "code": "AUTH_INVALID"
}

{
  "success": false,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}

{
  "success": false,
  "message": "Student not found",
  "code": "NOT_FOUND"
}
```

---

## Request Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get students
curl http://localhost:5000/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Axios (JavaScript)

```javascript
const client = axios.create({
  baseURL: 'http://localhost:5000'
});

// Add token to header
client.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Register
await client.post('/auth/register', {
  email: 'user@example.com',
  password: 'pass123',
  name: 'John'
});

// Get students
const response = await client.get('/students');
```

### Using Python Requests

```python
import requests

headers = {'Authorization': f'Bearer {token}'}

# Get students
response = requests.get('http://localhost:5000/students', headers=headers)
students = response.json()
```

---

## Rate Limiting

API has rate limiting (configurable):
- 100 requests per minute per IP
- Returns 429 if exceeded

---

## Pagination

Some endpoints support pagination:

```
GET /students?page=1&limit=10

Returns:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

**API Status:** ✅ Production Ready
**Documentation:** Complete
**Last Updated:** 2024
