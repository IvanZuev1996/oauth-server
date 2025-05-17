# 🛡️ Corporate OAuth 2.0 Authorization Server

A secure OAuth 2.0 authorization server designed for enterprise environments, supporting Authorization Code Flow with PKCE, dynamic access management, and proxy-based interaction with internal APIs.

## 🚀 Features

- OAuth client registration with admin approval
- Support for **Authorization Code Flow with PKCE**
- **Access** and **refresh token** generation and validation
- Flexible permission system using **scopes**
- Fine-grained access restrictions by:
  - IP address
  - Time of day and week
  - Geo-location (optional)
  - Request per minute
- **Proxy module** to forward authorized API requests to corporate services
- All access policies and restrictions can be configured dynamically via admin panel

## 🧩 Architecture

- **Backend:** NestJS (Node.js framework)
- **Authentication:** OAuth 2.0, PKCE, JWT
- **Database:** PostgreSQL
- **Frontend for Admin Panel:** (optional) React / Next.js (not included in this repo)

## 📦 Installation

```bash
git clone https://github.com/your-org/oauth-server.git
cd oauth-server
npm install
```

### Set up environment variables

Create a `.env` file based on `.env.example` and configure the following:

```env
PORT=3001
NODE_ENV=development

POSTGRES_HOST=localhost
POSTGRES_PORT=DB_PORT
POSTGRES_USER=DB_USER
POSTGRES_PASSWORD=DB_USER_PASSWORD
POSTGRES_DB=DB_NAME

ACCESS_TOKEN_SECRET=SECRET_KEY
ACCESS_TOKEN_LIFETIME=1d
REFRESH_TOKEN_SECRET=SECRET_KEY
REFRESH_TOKEN_LIFETIME=1d
COOKIES_EXPIRES_DAYS=1

OAUTH_ACCESS_TOKEN_LIFETIME=1h
REDIS_URL=redis://...
```

### Run the server

```bash
npm run start:dev
```

## 🔐 Security

This server implements multiple layers of protection:

- Authorization Code Flow with PKCE
- One-time authorization code with expiration
- Secure JWT token issuance and validation
- Scope-based access enforcement
- Additional restrictions (IP, time, location)

**Note:** This server is part of a diploma project focused on secure delegated authorization. Intended for educational and enterprise prototype use only.
