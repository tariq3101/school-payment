# 📘 School Payment

A **school payment management system** with a **backend** (API) and a **frontend** (web interface). The project helps streamline fee management, student payments, and reporting by integrating modern web technologies.

---

## 📑 Table of Contents
- [Introduction](#-introduction)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Dependencies](#-dependencies)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)

---

---
Project URL: https://school-payment-frontend-lime.vercel.app/
---

## 🚀 Introduction
This project provides a **full-stack application** to manage school payment processes. It consists of:
- **Backend (API)**: Handles authentication, payment processing, and data storage.
- **Frontend (UI)**: A web-based dashboard for students, staff, and administrators to interact with the system.

---

## ✨ Features
- Student registration and fee tracking
- Secure online payments
- Dashboard with payment history
- Modern frontend built with TypeScript
- Scalable backend with API endpoints

---

## 📂 Project Structure
```
school-payment/
│── backend/      # API & server-side logic
│── frontend/     # Web interface
│── README.md     # Project documentation
```

---
Sceenshots

![Login Screenshot](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001010.png?raw=true)
![All Transaction](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001123.png?raw=true)
![All Transaction with Dark Mode](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001137.png?raw=true)
![Transaction Status Check](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001203.png?raw=true)
![New Order](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001216.png?raw=true)
![Select School](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001234.png?raw=true)
![Trnsaction Status Check wirh Dark Mode](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001306.png?raw=true)
![External Payment Gateway](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001333.png?raw=true)
![Payment Status simulator](https://github.com/tariq3101/images/blob/main/Screenshot%202025-09-18%20001411.png?raw=true)

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/tariq3101/school-payment.git
cd school-payment
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

## ▶️ Usage

### Run Backend
```bash
cd backend
npm run start
```
Or
```
nodemon index.js
```

### Run Frontend
```bash
cd frontend
npm run dev
```

The frontend should now be available at `http://localhost:8080` (or configured port).  
The backend will run on `http://localhost:5000` (or configured port).

---

## 🔧 Configuration
Both backend and frontend may require environment variables. Create a `.env` file in each directory with values like:

```
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret
API_KEY=your_payment_provider_key
```

*(Update based on actual configuration in code.)*

---

## 📦 Dependencies

### Backend
- Node.js
- Express
- TypeScript
- Database client (e.g. MongoDB)

### Frontend
- React / Tyepscript
- CSS / Tailwind 
- Axios for API calls

*(Exact list comes from `package.json` files.)*

---

## 🛠 Troubleshooting
- **App not starting?** Check Node.js version (`>=16` recommended).
- **Database connection error?** Ensure your `.env` contains the correct `MONGO_URI`.
- **CORS issues?** Confirm backend CORS policy allows frontend origin.

---

## 👥 Contributors
- **tariq3101** – Creator & Maintainer  
- Contributions welcome! Submit a pull request or open an issue.

---
