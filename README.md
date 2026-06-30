# CRM Application

A modular, full-stack Customer Relationship Management (CRM) web application built with React, Tailwind CSS, Express, Node.js, and MongoDB.

## Features

- **Dashboard**: High-level KPIs (Total Customers, Active Leads, Total Deal Value, Win Rate) and Recent Activity.
- **Customer Management**: Full CRUD operations for Customers with status tags, notes, pagination, searching, and filtering.
- **Lead Management**: Track and update leads from different sources (web, referral, social, cold-call).
- **Deal Pipeline**: A Kanban board interface divided into deal stages (Prospecting, Proposal, Negotiation, Closed Won, Closed Lost).
- **Activity Log**: Keep track of calls, emails, meetings, and notes for each customer.
- **Out-of-the-box Dev DB**: Auto-fallback to `mongodb-memory-server` if no `MONGODB_URI` environment variable is defined.

## Project Structure

```text
crm-app/
├── client/          # Vite React frontend styled with Tailwind CSS
└── server/          # Node + Express + Mongoose backend
```

## Setup Instructions

### 1. Installation
In the root directory, run:
```bash
npm run install:all
```
This will install dependencies for both backend (`server`) and frontend (`client`), as well as root-level dev dependencies.

### 2. Configuration
Create a `.env` file in the `server` directory (or modify the template):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crm-db
```
*Note: If `MONGODB_URI` is omitted, the app will automatically start an in-memory MongoDB server (`mongodb-memory-server`) for development.*

Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the App
To run both frontend and backend concurrently in development mode:
```bash
npm run dev
```

- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:5000/`
