# Interactive Gym Management Web Application

## Project Overview

The goal of this project was to develop a **full-stack web application** for gym management that provides an interactive platform for both regular users and administrators.

## Features

### For Regular Users:
- View personal training statistics and progress.
- Log new training sessions.
- Track workout history over time.

### For Admin Users:
- Manage gym users (CRUD operations).
- Access extended gym statistics:
  - Overview of all users' training activity.
  - Subscription type breakdown and distribution.
  
  
## My role in this project
I contributed to both **backend** and **frontend** development, including:
  - **Database**: Designed entity-relationship model, created database and abstract models
  - **Documentation**: Operations identification table design (`/doc`)
  -  **Backend**: Implemented CRUD operations for users, trainings, and categories, created Pydantic schemas, and developed REST APIs  
  - **Integration**: Integrated APIs into frontend
  - **Frontend**: Built statistics pages with charts and assisted with components design
  - **Docker Setup**: Designed and configured Docker containers for backend, frontend and Database
  - **Project Support**: Coordinated project and organized workflow

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Database**: MariaDB

## Installation

See the [INSTALL.md](./INSTALL.md)  file for detailed setup instructions.

## Authors

See the [AUTHORS.md](./AUTHORS.md) file for team member information.

## Screenshots

### Authentication
<div align="center">
  <img src="react/public/images/image.png" alt="User login interface" width="70%">
  <p><em>Login page with user authentication form</em></p>
</div>

### User Interface

  Personal Statistics Dashboard
<div align="center">
  <img src="react/public/images/image-1.png" alt="Weekly training statistics" width="70%">
  <p><em>Weekly training progress</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-2.png" alt="Monthly training statistics" width="70%">
  <p><em>Monthly training statistics</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-3.png" alt="All-time training statistics" width="70%">
  <p><em>Comprehensive all-time statistics by categories</em></p>
</div>

  Training Management
<div align="center">
  <img src="react/public/images/image-4.png" alt="Exercise categories page" width="70%">
  <p><em>Main user page displaying available exercise categories</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-6.png" alt="Training timer interface" width="70%">
  <p><em>Workout timer page</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-5.png" alt="Active training session" width="70%">
  <p><em>Active training session with real-time timer</em></p>
</div>

  User Profile
<div align="center">
  <img src="react/public/images/image-7.png" alt="User profile settings" width="70%">
  <p><em>Personal profile management and settings</em></p>
</div>

### Admin Interface

  Dashboard & User Management
<div align="center">
  <img src="react/public/images/image-8.png" alt="Admin main dashboard" width="70%">
  <p><em>Admin main dashboard with user management tools</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-12.png" alt="Admin user management" width="50%">
  <p><em>Filters and seachbar</em></p>
</div>

  Analytics & Statistics
<div align="center">
  <img src="react/public/images/image-9.png" alt="Monthly gym statistics" width="70%">
  <p><em>Monthly gym activity analytics</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-10.png" alt="Exercise categories statistics" width="70%">
  <p><em>Popular exercise categories and member engagement</em></p>
</div>

<div align="center">
  <img src="react/public/images/image-11.png" alt="Weekly gym statistics" width="70%">
  <p><em>Weekly gym activity trends </em></p>
</div>