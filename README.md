# Intern Assignment - Auth & Task API

 It's a full-stack app with a Node.js backend and a React frontend.

## What it does

### Backend
*   User registration and login (using bcrypt for passwords and JWT for tokens).
*   Task CRUD: You can create, read, update, and delete tasks.
*   Security: Used Helmet and CORS to keep things secure.
*   Database: Postgres with Sequelize. Everything syncs automatically when you start the server.

### Frontend
*   Built with React and Vite.
*   Simple dashboard with a glassmorphism look (vanilla CSS).
*   Uses Context API to manage the login state.

## How to run it

### 1. Database
Make a Postgres database (I called mine `intern_api_db`). Update the `backend/.env` file with your postgres info:
```env
DB_NAME=intern_api_db
DB_USER=your_user
DB_PASSWORD=your_pass
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=some_random_secret
```

### 2. Backend
```bash
cd backend
npm install
node server.js
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Testing
I've included a Postman collection in the root: `Intern_API_Postman_Collection.json`. 
The base URL is `http://localhost:5000/api`. Just login first to get the token.

## Thoughts on Scalability

If I were to take this further and make it production-ready, here’s what I’d look at:

*   **Caching**: I'd add Redis to cache the tasks or user info. Sequelize is great, but hitting the DB for every single GET request isn't ideal if the traffic scales up.
*   **Rate Limiting**: Right now, someone could spam the login/register endpoints. I should probably add `express-rate-limit` to block IP spams.
*   **Architecture**: If this gets huge, I'd split the auth and tasks into their own services. For now, the monolithic approach is easier to maintain.
*   **Background Jobs**: Things like sending welcome emails or cleaning up old tasks should be moved to a background worker (like BullMQ) so they don't block the actual API response.

