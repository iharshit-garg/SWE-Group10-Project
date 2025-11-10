# HealthMe - Group 10 Software Engineering Project

This repository contains the backend server for the HealthMe telehealth application. It is built with Node.js, Express, and MongoDB and provides a RESTful API for all application functionalities.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (A local instance or a free Atlas cluster)
- [Thunder Client](https://www.thunderclient.com/) (or Postman) for API testing

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/iharshit-garg/SWE-Group10-Project.git](https://github.com/iharshit-garg/SWE-Group10-Project.git)
    cd SWE-Group10-Project/healthme-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    - In the `healthme-backend` folder, create a new file named `.env`.
    - Copy the contents from `.env.example` and fill in your actual database connection string and secrets.
    ```env
    PORT=3000
    MONGO_URI="your_mongodb_connection_string"
    JWT_SECRET="choose_a_long_random_secret_string"
    OPENAI_API_KEY="your_openai_api_key"
    ```

4.  **Run the server:**
    ```bash
    node index.js
    ```
    You should see a confirmation that the server is running on `http://localhost:3000`.

---

## API Documentation

**Base URL:** All API endpoints start with `http://localhost:3000`

