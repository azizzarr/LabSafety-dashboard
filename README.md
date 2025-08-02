# Smart Workplace Safety & Compliance Platform

A modular and intelligent web application designed to enhance safety, compliance, and predictive maintenance within workplace environments such as labs, factories, and industrial sites. Originally focused on Electrostatic Discharge (ESD) monitoring, the platform now integrates broader safety functionalities powered by AI and real-time analytics.

## 🚀 Overview

This platform leverages predictive AI and modern web technologies to help organizations:

- Monitor ESD levels and PPE compliance in real time
- Predict the lifespan of insulating safety equipment (e.g., shoes)
- Track environmental and ergonomic risks
- Detect anomalies in employee behavior
- Automate safety reporting and regulatory audits
- Provide smart dashboards and safety scoring

Built on a microservices architecture, each feature is modular, scalable, and secured with token-based access and full traceability.

---

## 🔍 Key Features

- **ESD & PPE Compliance Monitoring**  
  Real-time alerts for unsafe ESD levels or missing protective equipment.

- **Predictive AI Models (Prophet by Meta)**  
  AI-powered prediction of PPE degradation, safety risks, and maintenance scheduling.

- **Environmental & Ergonomic Hazard Tracking**  
  Continuous monitoring of temperature, noise, and humidity with alerts for unsafe conditions.

- **Incident Logging & Behavioral Anomaly Detection**  
  Streamlined issue reporting system and pattern detection of risky behaviors using AI.

- **Interactive Dashboard & Safety Scores**  
  Real-time visualization of alerts, stats, trends, and individual safety performance.

- **Training & Certification Management**  
  Monitors safety training status and notifies users and HR of pending renewals.

- **Audit & Compliance Reporting**  
  Exportable reports in PDF/Excel formats aligned with OSHA/ISO standards.

- **User & Permission Management**  
  Role-based access (Admin, HR, User) with secure authentication and activity logs.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Java** | Core backend logic for key services |
| **Spring Boot** | REST API development, microservice infrastructure |
| **Angular** | Frontend development and interactive dashboard |
| **Python** | Prediction microservice for AI processing |
| **Flask** | Lightweight backend for the AI module |
| **Facebook Prophet (LLM)** | Time-series forecasting for predictive maintenance and PPE age |
| **JWT (Bearer Tokens)** | Secure authentication and role-based access control |
| **Microservice Architecture** | Scalable, loosely coupled modules for each domain (Admin, Alerts, Workers, Prediction) |

---

## 📦 Microservices

- **Access Management Service** – Handles authentication, roles, and user permissions  
- **Workers Management Service** – Manages worker profiles, PPE data, and safety history  
- **Alerts Service** – Real-time ESD/environmental alerting and Firebase integration  
- **Prediction Service** – Built with Flask and Prophet, forecasts safety events and PPE wear-out  

---

## 📈 Benefits

- Ensures proactive safety management with predictive intelligence  
- Reduces risks and compliance costs  
- Enhances transparency, auditability, and decision-making through data  
- Adaptable to various industrial and lab environments

## 🔐 Security

- JWT-based authentication  
- Role and permission checks  
- Full activity traceability and secure API access
