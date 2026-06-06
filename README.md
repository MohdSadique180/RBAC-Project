# Spring Boot JWT Authentication & Role-Based Access Control (RBAC)

## Overview

This project demonstrates a secure Authentication and Authorization system using:

* Spring Boot 3
* Spring Security
* JWT (JSON Web Token)
* Role-Based Access Control (RBAC)
* Spring Data JPA
* H2/MySQL Database
* MapStruct
* Swagger/OpenAPI
* Lombok

Users can register, log in, receive a JWT token, and access endpoints based on their assigned roles.

---

## Features

### Authentication

* User Registration
* User Login
* Password Encryption using BCrypt
* JWT Token Generation
* JWT Token Validation

### Authorization

* Public Endpoints
* USER Protected Endpoints
* ADMIN Protected Endpoints
* Role-Based Access Control (RBAC)

### Additional Features

* Global Exception Handling
* Request Validation
* Swagger API Documentation
* Clean Layered Architecture

---

## Project Structure

```text
src/main/java
│
├── config
│   ├── SecurityConfig
│   └── OpenApiConfig
│
├── controller
│   ├── AuthController
│   └── ContentController
│
├── dto
│   ├── RegisterRequest
│   ├── LoginRequest
│   ├── AuthResponse
│   └── UserResponse
│
├── entity
│   ├── User
│   └── Role
│
├── repository
│   └── UserRepository
│
├── security
│   ├── JwtUtil
│   ├── JwtAuthFilter
│   └── CustomUserDetailsService
│
├── service
│   └── AuthService
│
└── exception
    └── GlobalExceptionHandler
```

---

## Roles

```java
USER
ADMIN
```

### Access Rules

| Endpoint    | Access      |
| ----------- | ----------- |
| /api/public | Everyone    |
| /api/user   | USER, ADMIN |
| /api/admin  | ADMIN Only  |

---

## API Endpoints

### Register

```http
POST /api/auth/register
```

Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

Response

```json
{
  "token": "jwt-token",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

---

### Login

```http
POST /api/auth/login
```

Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "jwt-token",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

---

### Public Endpoint

```http
GET /api/public
```

---

### User Endpoint

```http
GET /api/user
Authorization: Bearer <JWT_TOKEN>
```

---

### Admin Endpoint

```http
GET /api/admin
Authorization: Bearer <JWT_TOKEN>
```

---

## Security Flow

```text
User Registers
      ↓
Password Encrypted
      ↓
User Saved to Database
      ↓
JWT Generated
      ↓
User Login
      ↓
JWT Returned
      ↓
Client Sends JWT
      ↓
JWT Filter Validates Token
      ↓
Spring Security Checks Role
      ↓
Access Granted / Denied
```

---

## Running the Project

### Clone Repository

```bash
git clone https://github.com/your-username/springboot-jwt-rbac.git
```

### Navigate to Project

```bash
cd springboot-jwt-rbac
```

### Run Application

```bash
mvn spring-boot:run
```

Application will start on:

```text
http://localhost:8080
```

---

## Swagger Documentation

After running the application:

```text
http://localhost:8080/swagger-ui/index.html
```

Use the Authorize button to test secured APIs using JWT tokens.

---

## Technologies Used

* Java 21
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* MapStruct
* Lombok
* Swagger/OpenAPI
* Maven
* H2/MySQL

---

## Author

Mohd Sadique

Spring Boot Developer | Java Developer
