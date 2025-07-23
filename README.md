# 🏦 Bank App

### 🎥 Demo

[Watch the demo on YouTube](https://youtu.be/QdMUTbSxnO8?si=hIKRFlrnCw_4WxRJ)

**Bank App** is a fully responsive, simulation-based web banking application that allows users to manage multiple currency accounts. The app supports financial operations such as deposits, withdrawals, transfers between users, and currency conversions using exchange rates from an external API.

---

## ✨ Main Features

- 🔐 **Login and registration system** (NextAuth + Prisma)
- 💼 **4 currency accounts** per user (PLN, EUR, USD, GBP)
- 💸 **Deposits and withdrawals** for each account
- 🔄 **Transfers between users** within the app
- 🌍 **Currency conversion** using real-time exchange rates from an external API
- 📈 **Dynamic exchange rate calculations**
- 🔔 **Notifications and modals** (Mantine)

---

## 🧰 Tech Stack

### Frontend

- **Next.js 15 (App Router)**
- **React 19 + TypeScript**
- **Mantine UI** – components, forms, notifications
- **Zod + React Hook Form** – form validation and handling
- **TanStack React Query** – API data management

### Backend

- **Next.js (API routes)**
- **Prisma ORM + MySQL**
- **NextAuth** – authentication and session management

---

## 🧑‍💻 How to Run the Project Locally

```bash
# 1. Clone the repository
git clone https://github.com/vvrega/bank-app.git
cd bank-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in the .env.local file with appropriate values (DB_URL, API_KEY, etc.)

# 4. Initialize the database
npx prisma generate
npx prisma db push

# 5. Start the development server
npm run dev
```

By default, the app will be available at: http://localhost:3000
