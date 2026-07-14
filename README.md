# 📅 CampusEventsHub

> A full-stack MERN application that digitizes campus event management by enabling students to discover and register for events while providing administrators with tools to manage events, verify attendance through QR-code scanning, generate participation certificates, and export attendance reports.

---

## 📖 Overview

CampusEventsHub is a centralized event management platform designed to simplify the organization of college events. The platform replaces manual registration and attendance processes with a digital workflow using QR-based attendance verification, automated certificate generation, email notifications, and administrative reporting.

The system consists of two dashboards:

- 👨‍🎓 Student Dashboard
- 👨‍💼 Administrator Dashboard

---

## ✨ Features

### 👨‍🎓 Student Dashboard

Students can create an account and securely log in to access the event portal.

#### Features

- User Registration & Login
- Browse all campus events
- View ongoing, upcoming, and completed events
- View detailed event information
- Register for events
- Receive confirmation email
- Receive a unique QR code via email
- Track attendance status
- Download participation certificates

---

### 📅 Event Information

Each event displays:

- Event Poster
- Event Name
- Description
- Venue
- Start Date & Time
- End Date & Time
- Registration Progress
- Number of Registered Students

---

### 👨‍💼 Administrator Dashboard

The administrator manages the complete event lifecycle through a dedicated dashboard.

#### Features

- Add new events
- Edit existing events
- Delete events
- Publish events requested by event hosts
- Scan student QR codes
- Verify attendance
- Automatically generate participation certificates
- Export attendance reports in Excel format

---

## 📱 QR-Based Attendance Workflow

1. Student registers for an event.
2. Registration details are stored in MongoDB.
3. A confirmation email is sent using Nodemailer.
4. The email contains a unique QR Code.
5. During the event, the administrator scans the QR code.
6. Attendance is marked automatically.
7. Participation certificates are generated.
8. Students can download certificates from their dashboard.

---

## 📊 Excel Report Generation

The administrator can download an Excel report containing:

- Student Name
- Email
- Event Name
- Registration Status
- Attendance Status
- Certificate Status

This helps organizers efficiently manage event participation records.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React.js, React Router DOM, Axios |
| Server | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT |
| Email Service | Nodemailer |
| QR Code | QRCode |
| Certificate Generation | PDFKit |
| Excel Reports | ExcelJS |

---

## 🏗️ System Architecture

```text
          React.js Frontend
                  │
          REST API (Axios)
                  │
        Node.js + Express Server
                  │
        Authentication & Business Logic
                  │
             MongoDB Database
```

---

## 📂 Project Structure

```text
CampusEventsHub/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── services/
│   │   └── App.js
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/23WH1A0549/CampusEventsHub.git
```

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
cd server
npm install
npm start
```

### Start the Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

## 📸 Screenshots

Add screenshots of:

- Student Dashboard
- Event Registration
- Event Details
- QR Code Email
- QR Attendance Scanner
- Certificate Generation
- Administrator Dashboard
- Add Event Form
- Excel Report

---

## 📈 Future Enhancements

- Event Host Dashboard
- Mobile Application
- Event Feedback & Ratings
- Push Notifications
- Calendar Integration
- AI-Based Event Recommendations
- Real-Time Analytics

---

## 👩‍💻 Author

**Vaishnavi Minipuri**

B.Tech – Computer Science & Engineering

BVRIT Hyderabad College of Engineering for Women

---

## 📄 License

This project is developed for educational purposes.
