# 🐛 MERN Bug Tracker

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)

A fully-featured, cross-platform Project Management & Bug Tracking application. This system features a highly responsive React web client, a sleek Expo-based React Native mobile app, and a robust Node.js/Express backend API connected to MongoDB.

## ✨ Features

- **Cross-Platform Access:** Manage your projects seamlessly through the web browser or on-the-go with the mobile app.
- **Project Tracking:** Create independent projects, view active members, and organize your organization's goals.
- **Robust Issue Boards:** Generate tickets/issues mapped explicitly to your projects. Update their state ("To Do", "In Progress", "Done") with elegant UI navigation.
- **Real-Time Collaboration:** View and attach persistent comments directly into complex tickets. 
- **Secure Authentication:** JSON Web Token (JWT) secured endpoints, properly segregated across `Auth`, `Project`, and `Ticket` pipelines.
- **Modern UI/UX:** Built with dark themes, scalable vectors (Lucide/HeroIcons), robust Drag & Drop, and beautiful system alerts.

## 🏗️ System Architecture

The monorepo is divided strictly into three main branches:

### 1. `server/` (Backend Ecosystem)
The neural center controlling all state operations.
- Powered by Node.js and Express.
- Complete set of RESTful API endpoints.
- Auto-fallback to In-Memory Mock MongoDB during local development if local installation fails.

### 2. `client/` (Web Application)
The high-level dashboard designed for mouse-and-keyboard orchestration.
- Powered by React + Vite.
- Styled thoroughly via TailwindCSS with highly interactive components.
- Supports complete drag-and-drop mechanics for ticket advancement (like Trello).

### 3. `mobile/` (React Native Mobile App)
An on-the-go portal built exclusively for native platforms.
- Powered by Expo & React Native.
- Deep integration with `AsyncStorage` caching token states.
- Clean Stack Navigation pushing dedicated Project and Ticket Detail views cleanly.
- Bundled with a custom visual App Logo & Splash Screen.

## 🚀 Getting Started

To operate this pipeline locally, simply clone the repository and execute the installations:

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/guruprasadgodamgave400-design/Bug-Tracker.git

# Move into the folder
cd Bug-Tracker
```

### Running the Backend & Web Client
```bash
# From the root directory, install concurrency controllers:
npm install

# Start both the NodeJS backend and the React Vite web app simultaneously
npm run dev
```

### Running the Mobile Client
```bash
# In a new terminal, navigate to the mobile folder
cd mobile

# Install mobile dependencies
npm install

# Boot up the Expo Dev Client (pressing 'c' will clear the cache)
npx expo start -c
```
*(You can run this on a physical device using the Expo Go app or an Android Emulator/iOS simulator).*
