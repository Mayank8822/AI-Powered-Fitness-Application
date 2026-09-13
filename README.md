# 🏋️ AI-Powered Fitness Application

An AI-powered fitness application built using **React.js, Spring Boot, and Microservices Architecture**. The application allows users to track their fitness activities and receive personalized AI-generated fitness recommendations.

## 🚀 Features

* 🔐 User authentication and authorization using Keycloak/OAuth2
* 👤 User management
* 🏃 Fitness activity tracking
* 🤖 AI-powered fitness recommendations
* 🗑️ Activity deletion with associated recommendation deletion
* 🔄 Asynchronous communication using RabbitMQ
* 🌐 API Gateway for routing and security
* 🔎 Service discovery using Netflix Eureka
* ⚙️ Centralized configuration using Spring Cloud Config Server
* 🗄️ PostgreSQL database for user data
* 🍃 MongoDB for fitness activities and recommendations
* 💻 React-based frontend
* 📱 Responsive and user-friendly interface

## 🏗️ Architecture

The application follows a **microservices architecture**.

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │      (Vite)         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     API Gateway     │
                         │    Spring Cloud     │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │    User     │       │  Activity   │       │     AI      │
       │   Service   │       │   Service   │       │   Service   │
       └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │ PostgreSQL  │       │   MongoDB   │       │   MongoDB   │
       │ User DB     │       │ Activity DB │       │Recommendation│
       └─────────────┘       └─────────────┘       └─────────────┘

                         ┌─────────────────────┐
                         │      RabbitMQ       │
                         │ Message Broker      │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │   Eureka Server     │
                         │ Service Discovery   │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │   Config Server     │
                         │ Centralized Config  │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │      Keycloak       │
                         │ Authentication      │
                         └─────────────────────┘
```

## 🧩 Microservices

### 1. User Service

Responsible for:

* User registration
* User information
* User data management
* PostgreSQL persistence

### 2. Activity Service

Responsible for:

* Creating fitness activities
* Retrieving activities
* Updating activities
* Deleting activities
* Storing activity information in MongoDB

### 3. AI Service

Responsible for:

* Processing fitness activity information
* Generating personalized recommendations
* Integrating with Google's Gemini API
* Storing recommendations in MongoDB

### 4. API Gateway

Acts as the single entry point for frontend requests.

Responsibilities include:

* Request routing
* Authentication/security
* Communication with microservices
* Service discovery integration

### 5. Eureka Server

Provides service discovery and allows microservices to locate each other dynamically.

### 6. Config Server

Provides centralized configuration for the microservices.

### 7. RabbitMQ

Used for asynchronous communication between services.

For example:

```text
Activity Created
       ↓
Activity Service
       ↓
RabbitMQ
       ↓
AI Service
       ↓
Generate Recommendation
       ↓
Store Recommendation
```

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* Redux Toolkit
* Material UI
* Axios
* React Router

### Backend

* Java
* Spring Boot
* Spring Cloud
* Spring Cloud Gateway
* Spring Cloud Config
* Spring Data JPA
* Spring Data MongoDB
* Netflix Eureka

### Databases

* PostgreSQL
* MongoDB

### Messaging

* RabbitMQ

### Authentication

* Keycloak
* OAuth2 / JWT

### AI

* Google Gemini API

## 📁 Project Structure

```text
AI Powered Fitness Application/
│
├── activity-service/
│   └── Fitness activity microservice
│
├── ai-service/
│   └── AI recommendation microservice
│
├── user-service/
│   └── User management microservice
│
├── gateway/
│   └── API Gateway
│
├── eureka/
│   └── Eureka Service Discovery Server
│
├── configServer/
│   └── Spring Cloud Config Server
│
└── fitness-app-frontend/
    └── React frontend application
```

## ⚙️ Prerequisites

Install the following before running the application:

* Java JDK 25
* Maven
* Node.js and npm
* PostgreSQL
* MongoDB
* RabbitMQ
* Keycloak

## 🔐 Environment Variables

**Do not commit API keys, database passwords, tokens, or other secrets to GitHub.**

Create your environment variables locally.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=your_gemini_api_url
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
```

The actual values should remain on your local machine and should never be committed to the repository.

## 🗄️ Database Configuration

The application uses:

### PostgreSQL

```text
Database: fitness_user_db
```

Used by the User Service.

### MongoDB

```text
fitness_activity
fitness_recommendation
```

Used for fitness activities and AI-generated recommendations.

## ▶️ Running the Application

Start the infrastructure services first:

1. PostgreSQL
2. MongoDB
3. RabbitMQ
4. Keycloak

Then start the Spring Boot services.

Recommended order:

```text
1. Eureka Server
2. Config Server
3. User Service
4. Activity Service
5. AI Service
6. API Gateway
7. React Frontend
```

Start the frontend:

```bash
cd fitness-app-frontend
npm install
npm run dev
```

## 🔑 Authentication

The application uses **Keycloak** for authentication and authorization.

The frontend obtains an OAuth2/JWT token from Keycloak and sends the token with API requests.

```text
React
  ↓
Keycloak Login
  ↓
JWT Token
  ↓
API Gateway
  ↓
Microservices
```

## 🤖 AI Recommendations

The AI Service uses the **Google Gemini API** to generate fitness recommendations based on user activity information.

The API key is loaded through an environment variable rather than being stored directly in the source code.

## 📡 Communication

The system uses both synchronous and asynchronous communication.

### Synchronous

```text
Frontend
   ↓
API Gateway
   ↓
Microservice
```

### Asynchronous

```text
Activity Service
       ↓
    RabbitMQ
       ↓
   AI Service
       ↓
Recommendation
```

## 🔒 Security

The project follows basic security practices including:

* OAuth2 authentication
* JWT-based authorization
* API Gateway security
* Environment variables for sensitive configuration
* Separation of services and databases

> **Important:** Never commit `.env` files, API keys, database passwords, JWT secrets, private keys, or production credentials.

## 📸 Screenshots

Add screenshots of the application here.

Example:

```text
docs/
├── login.png
├── dashboard.png
├── activities.png
└── recommendations.png
```

You can then add them to this README:

```markdown
![Dashboard](docs/dashboard.png)
```

## 🔮 Future Improvements

* Wearable device integration
* Step and heart-rate tracking
* Workout plans
* Nutrition recommendations
* Progress analytics and charts
* Payment/subscription functionality
* Deployment using Docker
* CI/CD pipeline
* Cloud deployment

## 🎓 Project

This project was developed as a **BTech Computer Science and Engineering project** to demonstrate the practical implementation of:

* Microservices Architecture
* REST APIs
* Cloud-native application design
* Service Discovery
* API Gateway
* Distributed databases
* Message-driven communication
* OAuth2/JWT authentication
* Artificial Intelligence integration

## 📄 License

This project is intended for educational and academic purposes.
