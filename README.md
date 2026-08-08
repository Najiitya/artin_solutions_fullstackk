# Full-Stack Todo Application

A modern, responsive task management system featuring a decoupled architecture. The frontend is built with Next.js and Tailwind CSS, communicating securely via REST API with a Laravel backend powered by a PostgreSQL database.

## 🚀 Tech Stack

**Frontend:**
* Next.js (App Router)
* React Context API (Global State)
* Tailwind CSS (Styling)
* Axios (API Client)

**Backend:**
* Laravel (REST API)
* Laravel Sanctum (Token-based Authentication)
* PostgreSQL (Database)

## ✨ Features

* **Secure Authentication:** User registration, login, and logout using Sanctum Bearer tokens.
* **Task Management:** Create, view, and delete tasks.
* **Status Tracking:** Toggle tasks between "Pending" and "Completed".
* **Search & Filter:** Instantly filter tasks by status or search by keyword.
* **Protected Routes:** Automatic redirects for unauthenticated users.

---

## 🛠️ Local Setup & Installation

### Prerequisites
* Node.js & npm installed
* PHP & Composer installed
* PostgreSQL database running

### 1. Backend Setup (Laravel)
Navigate to the backend directory:
`bash
cd todo-backend
`

Install dependencies and configure the environment:
`bash
composer install
cp .env.example .env
php artisan key:generate
`

Update your `.env` file with your PostgreSQL database credentials and allow CORS for the frontend:
`env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=todo_app
DB_USERNAME=postgres
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000
`

Run the database migrations to build the tables:
`bash
php artisan migrate
`

Start the Laravel server:
`bash
php artisan serve
`
*The API will be available at `http://localhost:8000`*

### 2. Frontend Setup (Next.js)
Open a new terminal and navigate to the frontend directory:
`bash
cd todo-frontend
`

Install the required Node packages:
`bash
npm install
`

Configure the environment variables by creating a `.env.local` file in the root of the frontend folder:
`env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
`

Start the Next.js development server:
`bash
npm run dev
`
*The frontend will be available at `http://localhost:3000`*

---

## 🚦 Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. You will be redirected to the login screen.
3. Click "Register here" to create a new account.
4. Once registered, you will be taken to your dashboard where you can start managing your tasks.

## 👨‍💻 Author
**Najith Nethwan**
