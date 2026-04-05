# 📊 Finance Dashboard Backend

A backend system for managing financial records with role-based access control and dashboard analytics.

---

## 🚀 Features

### 🟢 User Management

* Signup & Login (JWT + cookies)
* Role-based access:

  * **Admin**
  * **Analyst**
  * **Viewer**
* User status (active / inactive)

---

### 🟢 Financial Records

* Add records (income / expense)
* View records
* Update records
* Delete records
* Filter records by:

  * type
  * category
  * date range

---

### 🟢 Dashboard APIs

Provides aggregated data:

* Total income
* Total expense
* Net balance
* Category-wise totals
* Recent activity
* Monthly trends

---

### 🟢 Access Control

| Role    | Permissions                  |
| ------- | ---------------------------- |
| Admin   | Full access (all users data) |
| Analyst | Manage own records           |
| Viewer  | View dashboard only          |

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## 📦 Installation

```bash
git clone https://github.com/vansh909/zorvyn-assessment.git
cd zorvyn-assessment
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zorvyn-assessment
JWT_SECRET=jwt_secret
```

---

## ▶️ Run the Server

```bash
node server.js 
```

---

## 📡 API Endpoints

### 🟢 Auth

* `POST /users/signup`
* `POST /users/login`

---

### 🟢 Records

* `POST /records` → Add record
* `GET /records` → View records
* `PUT /records/:id` → Update record
* `DELETE /records/:id` → Delete record
* `GET /records/filter` → Filter records

---

### 🟢 Dashboard

* `GET /dashboard`

---

## 🔍 Filtering Example

```bash
GET /records/filter?type=expense&category=food&startDate=2026-04-01&endDate=2026-04-30
```

---

## 📊 Dashboard Response Example

```json
{
  "totalIncome": 7000,
  "totalExpense": 2000,
  "balance": 5000,
  "categoryTotals": {
    "food": { "income": 0, "expense": 2000 }
  },
  "monthlyTrends": {
    "Apr 2026": { "income": 7000, "expense": 2000 }
  }
}
```

---

## ⚠️ Notes

* Authentication handled using JWT (cookies)
* Role-based restrictions enforced at backend level
* Dashboard data is computed dynamically (not stored)

---

## 📌 Future Improvements

* Pagination for records
* Advanced search
* Rate limiting
* Unit testing

---

## 👨‍💻 Author

Vansh Tomer
