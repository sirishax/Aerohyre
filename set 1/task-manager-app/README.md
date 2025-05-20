# Task Manager Dashboard

A React-based task management application with priority-based sorting and urgency calculation.

## Features

- Create, Read, Update, and Delete tasks
- Priority levels (High, Medium, Low)
- Automatic urgency calculation based on deadline and priority
- Filter tasks by priority
- Real-time sorting based on urgency
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-app


## Project Structure
- /src
  - /components - React components
  - /config - Configuration files
  - App.js - Root component
  - TaskManager.js - Main application logic
  - styles.css - Global styles
## API Endpoints
The backend server runs on http://localhost:3001 with the following endpoints:

- GET /tasks - Fetch all tasks
- POST /tasks - Create a new task
- PUT /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task


