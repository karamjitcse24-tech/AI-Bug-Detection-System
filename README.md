# 🤖 AI Bug Detection System

An AI-powered web-based Bug Management System that helps developers report, manage, analyze, and track software bugs efficiently. The system uses Artificial Intelligence to automatically analyze bug descriptions, detect severity, provide reasons, and recommend practical actions.

---

## 📌 Project Overview

The AI Bug Detection System is designed to simplify the software bug reporting and management process.

Users can create bug reports by entering the bug title, description, severity, and status. The system provides an AI-powered analysis feature that examines the bug description and automatically determines whether the bug has Low, Medium, or High severity.

The system also provides an interactive dashboard for monitoring bug statistics, searching and filtering bug reports, updating existing bugs, deleting bugs, and viewing detailed AI analysis.

---

## ✨ Key Features

### 🐞 Bug Management
- Add new bug reports
- Update existing bug reports
- Delete bug reports
- View all reported bugs
- Track bug status

### 🤖 AI-Powered Bug Analysis
- Analyze bug descriptions using Gemini AI
- Automatically detect bug severity
- Generate an explanation for the detected severity
- Provide recommended actions
- Store AI analysis with the bug report

### 📊 Interactive Dashboard
- Total Bugs
- Open Bugs
- Closed Bugs
- High Severity Bugs
- Bug Severity Chart
- Bug Status Chart

### 🔎 Search and Filtering
- Search bugs by title
- Filter bugs by severity
- Filter bugs by status
- View filtered bug reports instantly

### 🗃️ Database Management
- Store bug reports in MySQL
- Store severity and status
- Store AI-generated reason
- Store AI-generated recommendation
- Automatically maintain creation and update timestamps

---

## 🛠️ Technologies Used

### Frontend
- React.js
- Material UI (MUI)
- Recharts
- Axios
- JavaScript

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST API
- Maven

### Database
- MySQL
- MySQL Workbench

### Artificial Intelligence
- Google Gemini API

### Development Tools
- Visual Studio Code
- IntelliJ IDEA
- Git
- GitHub

---

## 🏗️ System Architecture

```text
              ┌──────────────────────┐
              │      User            │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   React Frontend     │
              │   Material UI        │
              └──────────┬───────────┘
                         │
                    REST API
                         │
                         ▼
              ┌──────────────────────┐
              │   Spring Boot        │
              │      Backend         │
              └───────┬───────┬──────┘
                      │       │
                      │       ▼
                      │  ┌──────────────┐
                      │  │ Gemini AI    │
                      │  │ Bug Analysis │
                      │  └──────────────┘
                      │
                      ▼
              ┌──────────────────────┐
              │    MySQL Database    │
              │    bug_reports       │
              └──────────────────────┘