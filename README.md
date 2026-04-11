# E-Commerce Web Application

## Overview

This project is a full-stack e-commerce web application built using React for the frontend, ASP.NET Web API for the backend, and MySQL as the database. The system provides core functionalities such as product browsing, cart management, and order processing.

The project follows a modular and scalable architecture inspired by MVC, separating concerns between UI, business logic, and data handling.

---

## Project Identification

* **Project Name**: E-Commerce Web Application
* **Project URL**: https://github.com/Binsadboiiz/e-commerce.git)
* **Author**: Nguyen Phu Cuong, Nguyen Duong Ngoc Han

---

## Project Structure

### Frontend (React)

```id="f11"
frontend/
├── public/
│
├── src/
│   ├── assets/        # static resources (images, icons)
│   ├── components/    # reusable UI components (view layer)
│   ├── context/       # global state management
│   ├── features/      # feature-based modules
│   ├── hooks/         # custom hooks
│   ├── pages/         # page-level views
│   ├── routes/        # routing configuration
│   ├── services/      # API calls
│   ├── utils/         # helper functions
│   ├── styles/        # global styles
│   └── App.jsx
│
├── .env
├── vite.config.js
└── package.json
```

---

### Backend (ASP.NET Web API)

```id="f12"
backend/
├── src/
│   ├── Controllers/   # handle HTTP requests
│   ├── Services/      # business logic
│   ├── Repositories/  # data access layer
│   ├── Models/        # entity models
│   ├── DTOs/          # data transfer objects
│   ├── Data/          # DbContext and database config
│   ├── Middlewares/   # custom middleware
│   └── Program.cs
│
├── appsettings.json
└── ecommerce.sln
```

---

## Architecture

The project follows an MVC-inspired architecture:

* Model: Models, Data
* View: React UI in components, pages
* Controller: Controllers handle API requests
* Service Layer: Services contain business logic
* Repository Layer: Repositories handle database operations

This structure ensures clean separation of concerns and scalability.

---

## Features

* User authentication
* Product listing and search
* Category filtering
* Shopping cart management
* Order processing
* Admin management

---

## Project Evaluation

This project helps developers understand how to build a structured full-stack e-commerce system using modern technologies.

* With E-Commerce Web Application, you can build an online shopping system.
* E-Commerce Web Application helps you manage products, users, and orders.
* Unlike simple template projects, this project provides a clear separation between frontend and backend with a scalable architecture.

---

## Prerequisites

* Node.js
* .NET SDK
* MySQL Server

---

## Installation and Setup

### 1. Clone Repository

```bash id="f13"
git clone https://github.com/your-username/ecommerce-project.git
cd ecommerce-project
```

---

### 2. Run Backend

```bash id="f14"
cd backend
dotnet restore
dotnet run
```

---

### 3. Run Frontend

```bash id="f15"
cd frontend
npm install
npm run dev
```

---

## Verification

* Backend runs at: http://localhost:5000
* Frontend runs at: http://localhost:5173

Check:

* Product list is displayed
* API returns valid data
* Navigation works correctly

---

## Documentation and Contribution

* Documentation is provided in README.md
* API can be tested using Swagger
* Contributions via Pull Requests
* Issues handled through GitHub Issues

---

## Subjective Reflection

The project structure is clean and follows a scalable pattern with clear separation between layers. The combination of React, ASP.NET, and MySQL provides a strong foundation for building a real-world application.

However, the project can be improved by adding more detailed API documentation and system diagrams.

Overall, this project is suitable for learning and extending into a production-level system.

---

## License

This project is intended for educational purposes.

---
