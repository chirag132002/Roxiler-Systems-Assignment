# 🏪 Store Rating & Review System  

[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)  
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/API-Express-black?logo=express)](https://expressjs.com/)  
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)](https://www.mysql.com/)  

A **full-stack web application** that enables **users to rate stores**, **owners to manage their stores & ratings**, and **admins to manage the system**.  

## 🖼️ Screenshots

### 👤 User Dashboard
![User Dashboard](client/Store-Review/public/user-dashboard.png)

### 🏪 Store Owner Dashboard
![Owner Dashboard](client/Store-Review/public/store-owner-dashboard.png)

### 🔑 Admin Dashboard
![Admin Dashboard 1](client/Store-Review/public/admin-dashboard-1.png)
![Admin Dashboard 2](client/Store-Review/public/admin-dashboard-2.png)

### 🔐 Landing Page
![Landing Page](client/Store-Review/public/landing.png)

### 🔐 Login Page
![Login Page](client/Store-Review/public/login-user.png)

### 📝 Signup Page
![Signup Page](client/Store-Review/public/signup-page.png)
![Signup Page Form Validtion](client/Store-Review/public/signup-form-validation.png)

### 💾 Database Tables
![User Table](client/Store-Review/public/user-table.png)
![Store Table](client/Store-Review/public/Store-table.png)
![Ratings Table](client/Store-Review/public/ratings-table.png)

---

## ✨ Features  

### 👤 User  
- Sign up / Login (JWT authentication).  
- Search & filter stores by name and address.  
- Rate stores (⭐ 1–5, with update support).  
- View average ratings for each store.  

### 🏪 Store Owner  
- Login to their dashboard.  
- View details of their store.  
- Monitor all ratings submitted by users.  
- Change account password securely.  

### 🔑 Admin  
- Dashboard with counts (users, stores, ratings).  
- Manage users (filter by name, email, role, address).  
- Add new stores & assign to owners.  
- Manage store listings with average ratings.  

---

## 🛠️ Tech Stack  

- **Frontend:** React (Vite), Axios, TailwindCSS, React Router  
- **Backend:** Node.js, Express.js, JWT Authentication  
- **Database:** MySQL (with bcrypt password hashing)  
- **Other Tools:** React Hot Toast, GitHub for version control  

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/your-username/roxiler-assignment.git
cd roxiler-assignment
