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

## 📘 API Documentation

### 📝 Signup

**POST /users/signup**

Request:

```json
{
  "username": "user1",
  "email": "user@test.com",
  "password": "123456",
  "role": "analyst",
  "status": "active"
}
```

Response:

```json
{
  "message": "new user created",
  "userDetails": {
    "id": "...",
    "username": "user1",
    "email": "user@test.com",
    "role": "analyst",
    "status": "active"
  }
}
```

---

### 🔐 Login

**POST /users/login**

Request:

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

Response:

```json
{
  "message": "welcome analyst",
  "user": {
    "id": "...",
    "username": "...",
    "email": "..."
  }
}
```

---

### ➕ Add Record

**POST /records**

Request:

```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "notes": "monthly salary"
}
```

Response:

```json
{
  "message": "Record added successfully"
}
```

---

### 📄 View Records

**GET /records**

Response:

```json
{
  "message": "records fetched successfully",
  "records": []
}
```

---

### ✏️ Update Record

**PUT /records/:id**

id is passed as URL parameter

Example:

```bash
PUT /records/record_id_here
```

Request:

```json
{
  "amount": 7000,
  "category": "freelance"
}
```

Response:

```json
{
  "message": "record updated successfully!"
}
```

---

### ❌ Delete Record

**DELETE /records/:id**

id is passed as URL parameter

Example:

```bash
DELETE /records/record_id_here
```

Response:

```json
{
  "message": "record deleted successfully!"
}
```

---

### 🔍 Filter Records

**GET /records/filter**

Example:

```bash
GET /records/filter?type=expense&category=food&startDate=2026-04-01&endDate=2026-04-30
```

---

### 📊 Dashboard

**GET /dashboard**

Request (admin optional):

```json
{
  "email": "user@test.com"
}
```

Response:

```json
{
  "totalIncome": 7000,
  "totalExpense": 2000,
  "balance": 5000,
  "categoryTotals": {},
  "monthlyTrends": {}
}
```

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
