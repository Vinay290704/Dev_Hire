# Dev_Hire: A Modern Hiring Platform

Dev_Hire is a full-stack web application designed to facilitate the hiring process, connecting job seekers with recruiters. It features a robust authentication system built with JWTs (JSON Web Tokens) to ensure secure user management and API access.

## Features

- **User Authentication**: Secure registration and login functionalities
- **JWT-based Authorization**: Utilizes Access Tokens for short-lived, secure API access and Refresh Tokens for seamless session renewal
- **Refresh Token Rotation**: Enhances security by issuing a new Refresh Token with each refresh request
- **Protected Routes**: API endpoints are secured, requiring valid Access Tokens for access
- **User Logout**: Allows users to invalidate their sessions
- **Responsive Frontend**: Built with React and Tailwind CSS for a modern and adaptive user interface
- **Toast Notifications**: Provides user-friendly feedback for various actions using react-toastify
- **Animated Transitions**: Smooth page transitions powered by Framer Motion

## Technologies Used

### Backend (Node.js/Express.js)
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **Sequelize**: ORM (Object-Relational Mapper) for Node.js, interacting with MySQL
- **MySQL**: Relational database for data storage
- **bcrypt**: Library for hashing passwords securely
- **jsonwebtoken (JWT)**: For creating and verifying secure tokens
- **express-async-handler**: Simplifies error handling for async Express routes
- **dotenv**: To manage environment variables
- **cors**: Middleware for enabling Cross-Origin Resource Sharing

### Frontend (React)
- **React**: JavaScript library for building user interfaces
- **react-router-dom**: For declarative routing in React applications
- **react-toastify**: For customizable toast notifications
- **framer-motion**: For declarative animations
- **lucide-react**: For lightweight and customizable SVG icons
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Vite**: A fast build tool for modern web projects

## Getting Started

Follow these steps to set up and run Dev_Hire on your local machine.

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (Node Package Manager)
- MySQL Server running

### 1. Backend Setup

**Clone the repository:**
```bash
git clone [[<repository-url>](https://github.com/Vinay290704/Dev_Hire)]
cd Dev_Hire/Backend 
```

**Install dependencies:**
```bash
npm install
```

**Create a .env file:**
In the backend directory, create a file named `.env` and add the following environment variables. Replace the placeholder values with your actual database credentials and generated JWT secrets.

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dev_hire_db
DB_DIALECT=mysql
DB_PORT=3306

# Server Port
PORT=5000

# JWT Secrets (Generate these using Node's crypto module: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ACCESS_TOKEN_SECRET=your_very_strong_and_random_access_token_secret_here
REFRESH_TOKEN_SECRET=your_very_strong_and_random_refresh_token_secret_here
```

**Database Setup:**
Ensure your MySQL server is running. The application will attempt to connect to the database and sync models (create tables if they don't exist) on startup. Make sure the `DB_NAME` database exists or is created by your MySQL user.

**Run the backend server:**
```bash
npm run dev
```

The server should start on `http://localhost:5000` (or your specified PORT).

### 2. Frontend Setup

**Navigate to the frontend directory:**
```bash
cd Frontend
```

**Install dependencies:**
```bash
npm install
```

**Create a .env file:**
In the frontend directory, create a file named `.env` and add the following environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api/auth
```

**Note:** Adjust the URL if your backend is running on a different port or domain.

**Run the frontend development server:**
```bash
npm run dev
```

The frontend application should open in your browser, typically at `http://localhost:5173`.

## API Endpoints

The backend exposes the following authentication-related API endpoints:

### POST `/api/users/auth/register`
- **Description**: Registers a new user and automatically logs them in
- **Request Body**: `{ name, username, email, password }`
- **Response**: User details, accessToken, refreshToken

### POST `/api/users/auth/login`
- **Description**: Authenticates an existing user
- **Request Body**: `{ identifier, password }` (where identifier can be username or email)
- **Response**: User details, accessToken, refreshToken

### POST `/api/users/auth/refresh`
- **Description**: Exchanges an expired refreshToken for a new accessToken (and a new refreshToken if rotation is enabled)
- **Request Body**: `{ refreshToken }`
- **Response**: New accessToken, new refreshToken

### POST `/api/users/auth/logout`
- **Description**: Invalidates the user's session by revoking their refreshToken on the server
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response**: Success message

### `/api/users/auth/protected-resource` (Example)
- **Description**: A placeholder for any API endpoint that requires authentication
- **Headers**: `Authorization: Bearer <accessToken>`
- **Note**: You would need to implement this endpoint on your backend for testing

## Authentication Flow

Dev_Hire utilizes a secure JWT-based authentication flow:

1. Upon registration or login, the server issues a short-lived `accessToken` and a long-lived `refreshToken`
2. The `accessToken` is used to access protected API routes by including it in the `Authorization: Bearer` header
3. When the `accessToken` expires (typically after 15 minutes), the frontend uses the `refreshToken` to request a new `accessToken` from the `/api/users/auth/refresh` endpoint
4. The `refreshToken` is stored in the database and is rotated (a new one is issued) with each successful refresh, enhancing security
5. Logout explicitly revokes the `refreshToken` in the database, ending the user's session

## Error Handling

- The backend includes a centralized `errorHandler` middleware to catch and format API errors, providing consistent JSON responses with appropriate HTTP status codes (e.g., 400 for validation errors, 401 for unauthorized, 409 for conflicts, 500 for server errors)
- The frontend uses `react-toastify` to display these error messages and other feedback to the user in a non-intrusive way

## Contributing

Contributions are welcome! Please feel free to fork the repository, make changes, and submit pull requests.

## License

This project is open-source and available under the MIT License.
