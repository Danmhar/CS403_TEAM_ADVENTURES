# Group 6 Students API
 
A RESTful API for managing student records, built with Express and PostgreSQL. Features CRUD operations, JWT authentication with refresh token rotation, input validation, and interactive API documentation via Swagger.
 
**Team:** Adrian Nunez, Ace Dandan, Paolo Demeterio, Danmhar Padual
 
---
 
## Features
 
- Student CRUD (Create, Read, Update, Delete)
- JWT authentication (register, login, refresh, logout)
- Refresh token rotation with database-backed revocation
- Password hashing with bcrypt
- Input validation (text, email, password, student ID)
- Interactive API docs via Swagger UI
- Postman collection with automated tests covering 6 testing categories (happy path, missing fields, invalid data, auth required, not found, edge cases)
---
 
## Tech Stack
 
- **Runtime:** Node.js / Express
- **Database:** PostgreSQL
- **Auth:** JSON Web Tokens (access + refresh), bcrypt
- **Docs:** swagger-jsdoc, swagger-ui-express
---
 
## Project Structure
 
```
src/
├── config/
│   ├── database.js        # PostgreSQL connection pool
│   ├── initDatabase.js     # Creates/updates tables on startup
│   └── swagger.js          # Swagger/OpenAPI configuration
├── controllers/
│   ├── authController.js
│   └── studentController.js
├── middleware/
│   └── authMiddleware.js   # JWT verification middleware
├── models/
│   ├── authModel.js
│   └── studentModel.js
├── routes/
│   ├── authRoutes.js
│   └── studentRoutes.js
├── services/
│   └── tokenService.js     # Token generation/verification/hashing
├── validations/
│   └── validators.js       # Input validation helpers
└── app.js                  # Express app setup
server.js                    # Entry point
```
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js (v18+ recommended)
- PostgreSQL running locally or accessible remotely
### 1. Clone the repository
 
```bash
git clone https://github.com/Danmhar/CS403_TEAM_ADVENTURES.git
cd CS403_TEAM_ADVENTURES
```
 
### 2. Create a database
 
Run this in pgAdmin's Query Tool, or any PostgreSQL session:
 
```sql
CREATE DATABASE your_database_name;
```
 
You can use any database name. Just make sure it matches `DB_NAME` in your `.env` file. Your database user also needs permission to create and alter tables, since the app creates and updates its tables automatically on startup.
 
### 3. Install dependencies
 
```bash
npm install
```
 
### 4. Configure environment variables
 
Copy the example file and fill in your own values:
 
```bash
cp .env.example .env
```
 
Edit `.env` with your database credentials and JWT secrets. See [Environment Variables](#environment-variables) below for what each one does. **Never commit `.env` to version control.**
 
To generate a strong random secret for the JWT keys:
 
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
 
Run this twice — once for `JWT_ACCESS_SECRET` and once for `JWT_REFRESH_SECRET`. Use a different value for each.
 
### 5. Run the server
 
```bash
npm start
```
 
or
 
```bash
node server.js
```
 
The database tables are created automatically on startup if they don't already exist.
 
The API will be running at `http://localhost:3000` (or whatever `PORT` you set).
 
---
 
## Environment Variables
 
| Variable | Description |
|---|---|
| `PORT` | Port the server listens on |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens |
| `JWT_ACCESS_EXPIRES` | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `JWT_REFRESH_EXPIRES` | Refresh token lifetime (e.g. `7d`) |
 
> **Note:** Confirm these match the exact variable names read in `src/config/database.js` and `src/services/tokenService.js` — update this table if your `.env` uses different names.
 
---
 
## API Documentation
 
### Swagger
 
Once the server is running, open:
 
```
http://localhost:3000/api-docs
```
 
This provides interactive documentation for every endpoint. Click **Authorize** and paste an access token (obtained from `/auth/login`) to test protected routes directly from the browser.
 
### Postman
 
A Postman collection and environment are included in this repo under `docs/`:
 
- `docs/students-api.postman_collection.json`
- `docs/students-api.postman_environment.json`
Import both into Postman, select the environment, and run the collection. Requests are organized into **Auth** and **Students** folders, with both happy-path and negative test cases (missing fields, invalid data, unauthorized access, not found, and edge cases) covering all endpoints.
 
---
 
## Endpoints
 
### Auth (`/auth`)
 
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/auth/register` | Register a new student account | No |
| POST | `/auth/login` | Log in and receive access + refresh tokens | No |
| POST | `/auth/refresh` | Exchange a refresh token for a new token pair | No |
| POST | `/auth/logout` | Revoke a refresh token | No |
 
### Students (`/students`)
 
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `/students` | Get all students | Yes |
| GET | `/students/:id` | Get one student by ID | Yes |
| POST | `/students` | Create a student record | Yes |
| PUT | `/students/:id` | Update a student | Yes |
| DELETE | `/students/:id` | Delete a student | Yes |
 
> **Note:** `/auth/register` creates a student **with login credentials** (email + password). `POST /students` creates a student **record only**, with no login access — useful for adding students who won't need an account.
 
Protected routes require a Bearer token in the `Authorization` header:
 
```
Authorization: Bearer <accessToken>
```
 
---
 
## Testing
 
The Postman collection covers six categories for each relevant endpoint:
 
1. **Happy path** — valid input succeeds
2. **Missing fields** — required data omitted → 400
3. **Invalid data** — wrong type or malformed value → 400
4. **Auth required** — missing/invalid token → 401
5. **Not found** — nonexistent resource → 404
6. **Edge cases** — unusually long input, duplicate registration, token reuse, etc.
Run the full suite via Postman's **Run Collection** feature, or the Newman CLI if installed.
 
---
 
## Response Codes
 
| Code | Meaning |
|---|---|
| 200 | Request completed successfully |
| 201 | Student account created |
| 400 | Missing or invalid input, or malformed JSON |
| 401 | Missing, invalid, or expired credentials or token |
| 404 | Student or route not found |
| 409 | Email already registered |
| 500 | Database or other server error |
 
---
 
## Troubleshooting
 
| Problem | What to check |
|---|---|
| Database connection fails | Make sure PostgreSQL is running, the database exists, and the database settings and permissions are correct. |
| Swagger shows old endpoints | Restart the server and refresh `/api-docs`. |
| Protected requests return 401 | Log in again or refresh your token, then update Swagger authorization. |
| Registration returns 409 | Use another test email or log in to the existing account. |
| Port is already in use | Stop the process using that port or change `PORT` in `.env`. Use the new port in the Swagger URL. |
 
---
 
## Security Notes
 
- Passwords are hashed with bcrypt before storage; plaintext passwords are never saved or logged.
- Refresh tokens are stored as SHA-256 hashes, not in plaintext, and are rotated (deleted and reissued) on every use.
- `.env` is excluded from version control via `.gitignore`. Use `.env.example` as a template only.
- Error responses avoid leaking internal details (stack traces, DB error codes) to the client.
---
 
## License
 
This project was built for academic purposes as part of CS403 (Integrative Programming Languages 1), MCO1 submission.
 