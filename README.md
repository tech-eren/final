# CivicConnect 🏙️

CivicConnect is an open-source, AI-powered civic engagement platform designed to bridge the gap between citizens and city authorities. Built for the modern smart city, it provides a seamless interface for reporting infrastructure issues, analyzing civic data, and accelerating the resolution of public concerns.

## 🚀 Features

### For Citizens
* **Streamlined Issue Reporting**: Report potholes, broken streetlights, or drainage issues in three simple steps.
* **AI Auto-Fill (Prototype)**: Upload an image and let our mocked AI model automatically categorize and describe the issue.
* **Interactive Map View**: Explore reported issues in your neighborhood using the integrated OpenStreetMap viewer.
* **Real-time Status Tracking**: Monitor the progress of your reports from "Submitted" to "Resolved" directly from your dashboard.
* **Civic AI Assistant**: Ask questions and get guidance from the globally available floating AI chatbot.

### For Authorities & Admins
* **Authority Dashboard**: A high-level overview of city infrastructure health, including a heatmap of critical incidents.
* **Issue Triage**: A comprehensive data table for filtering, searching, and updating the status of incoming reports.
* **Civic Intelligence Feed**: An AI-powered insight feed that detects anomalies, clusters related reports, and predicts future infrastructure risks.
* **System Analytics**: Interactive charts (powered by Recharts) visualizing report volume, categorical distribution, and resolution performance.
* **User Management**: An admin interface for overseeing registered users and configuring platform access roles.

## 🛠️ Tech Stack

* **Framework**: React 18 with Vite
* **Routing**: React Router DOM v6
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **Maps**: React Leaflet & OpenStreetMap
* **Types**: TypeScript

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/tech-eren/try1.git
   cd try1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

* `src/components/`: Reusable UI components (Buttons, Cards, Inputs, Map elements, AI Chatbot).
* `src/layouts/`: Layout shells defining the navigation and sidebars for different user roles (Citizen, Authority, Admin).
* `src/pages/`: The primary views for the application, organized by role.
* `src/services/`: Services handling data access. Note: For this prototype, all data is mocked in memory via `issueService.ts`.
* `src/types/`: TypeScript definitions defining the core domain models (`Issue`, `User`, `CivicInsight`, etc).

## 💡 Known Limitations (Prototype)

This repository represents a hackathon frontend prototype:
* **Mock Data**: There is no backend database. All reported issues, analytics, and intelligence insights are generated dynamically in-memory and will reset upon page refresh.
* **Simulated AI**: The AI Auto-fill, Civic AI Assistant chatbot, and Civic Intelligence feeds use hardcoded or randomly generated mock responses. No external LLM API is actually invoked.
* **File Uploads**: Image uploading is simulated. Clicking the drag-and-drop zone toggles a mock success state.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
