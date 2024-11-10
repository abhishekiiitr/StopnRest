# STOP-N-REST Hotel Booking Platform

STOP-N-REST is a full-stack hotel booking platform that allows users to search, book, and manage hotel rooms with ease. The application is built using microservices architecture with Angular for the frontend and Spring Boot for the backend.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and authentication (JWT-based).
- Search and filter hotels by location, availability, and room category.
- Book rooms and manage bookings.
- Real-time room availability updates.
- Secure payment gateway integration (using a dummy payment gateway).
- Microservices architecture for scalability.
- Responsive design for desktop and mobile devices.

## Tech Stack
**Frontend:**
- Angular 16
- HTML, CSS, TypeScript

**Backend:**
- Java 17
- Spring Boot 3
- Hibernate & JPA
- MySQL/MongoDB

**Other Technologies:**
- Docker for containerization
- GitLab CI for Continuous Integration/Continuous Deployment (CI/CD)
- Postman for API testing

## Architecture
The project follows a microservices architecture with the following services:
1. **User Service**: Handles user authentication and profile management.
2. **Hotel Service**: Manages hotel details, room availability, and pricing.
3. **Booking Service**: Handles room bookings, cancellations, and payments.
4. **Notification Service** (Optional): For sending booking confirmations and updates.

## Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v16.x or later)
- **Angular CLI** (v16.x)
- **Java 17**
- **Maven** (for building the backend)
- **MySQL** (or MongoDB if you're using NoSQL)
- **Docker** (if running in a containerized environment)

### Installation
Clone the repository:
```bash
git clone https://github.com/your-username/STOP-N-REST.git
cd STOP-N-REST
```

### Running the Application

#### Backend
Navigate to the backend folder and build the project:
```bash
cd backend
mvn clean install
```
Run the backend services:
```bash
mvn spring-boot:run
```

#### Frontend
Navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```
Start the Angular development server:
```bash
ng serve
```

Access the application at [http://localhost:4200](http://localhost:4200).

## API Endpoints

### User Service
- `POST /api/v1/users/register`: Register a new user
- `POST /api/v1/users/login`: User login

### Hotel Service
- `GET /api/v1/hotels`: Fetch all hotels
- `GET /api/v1/hotels/{hotelId}`: Get hotel details by ID
- `POST /api/v1/hotels/update-room-availability`: Update room availability

### Booking Service
- `POST /api/v1/bookings/booknow`: Create a new booking
- `GET /api/v1/bookings/{bookingId}`: Get booking details
- `DELETE /api/v1/bookings/{bookingId}`: Cancel a booking

## Frontend Overview
The frontend is built using Angular and includes the following components:
- **Hotel List Component**: Displays a list of available hotels with filtering options.
- **Hotel Details Component**: Shows detailed information about a selected hotel.
- **Booking Component**: Allows users to book rooms and manage existing bookings.
- **User Profile Component**: Displays user information and booking history.

## Backend Overview
The backend is implemented using Spring Boot microservices:
- **Controllers**: Handle HTTP requests.
- **Services**: Contain business logic.
- **Repositories**: Communicate with the database.
- **Entities**: Represent data models.

### Database Schema
The project uses MySQL for relational data storage. Below is a simplified version of the schema:

#### Tables:
- **Users**: Stores user information.
- **Hotels**: Stores hotel details and room categories.
- **Bookings**: Stores booking transactions.

## Contributing
Contributions are welcome! Please follow the steps below:
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push the branch and create a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
