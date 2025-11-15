# 📝 Real-Time Task Manager

This project is a high-performance backend application built with **NestJS**, utilizing **GraphQL** for its API layer, **MongoDB** for persistent data storage, and **BullMQ** (powered by Redis) for asynchronous task management and real-time updates.

## 🚀 Features and Architecture

* **API Layer:** GraphQL (Apollo) with Type-GraphQL approach.
* **Data Persistence:** MongoDB via Prisma ORM.
* **Asynchronous Processing (BullMQ):** Offloads long-running tasks (e.g., report processing) to a background worker.
* **Real-Time Monitoring (Bull Board):** Visual dashboard for tracking job queues.
* **Real-Time Communication:** **WebSockets (Socket.IO)** and **GraphQL Subscriptions** for instant task status updates.
* **Containerization:** Infrastructure services (MongoDB, Redis) are managed using Docker Compose.

***

## 🛠️ Prerequisites

-   **Node.js** (v18+)
-   **npm** or **Yarn**
-   **Docker** & **Docker Compose**

## ⚙️ Installation & Setup

### 1. Install Dependencies

``` bash
npm install
```

### 2. Environment Variables (.env)

``` bash
DATABASE_URL="mongodb://user:password@localhost:27017/taskmanager_db?authSource=admin"
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Generate Prisma Client

``` bash
npx prisma generate
```

## 🐳 Running the Project

### 1. Start Docker Services

``` bash
docker-compose up -d
```

### 2. Start the NestJS Application

``` bash
npm run start:dev
```

## 💻 Core Implementation Details

### BullMQ Configuration

``` ts
BullModule.forRoot({
  connection: { host: 'localhost', port: 6379 },
}),
```

### Task Processor

Handles long-running tasks and emits status updates.

### Task Resolver

GraphQL mutations & subscriptions for task operations.

### WebSocket Gateway

Real-time broadcasting of task status updates.

## 🌐 Endpoints

  ---------------------------------------------------------------------------------------------------------------------
  Service                                     URL
  ------------------------------------------- -------------------------------------------------------------------------
  GraphQL Playground                          http://localhost:3000/graphql

  Bull Board                                  http://localhost:3000/bull-board

  WebSocket                                   ws://localhost:3000

  MongoDB                                     mongodb://user:password@localhost:27017/taskmanager_db?authSource=admin
  ---------------------------------------------------------------------------------------------------------------------

## 🧪 Testing

### Enqueue Task

``` graphql
mutation StartReport {
  enqueueReportProcessing(reportId: "REPORT-X")
}

mutation CreateTestUser {
  createUser(input: {
    email: "test@test.com",
    name: "Test Name"
  }) {
    id
    email
    name
  }
}

```

### Monitor

-   Bull Board dashboard
-   WebSocket or GraphQL Subscription listener
