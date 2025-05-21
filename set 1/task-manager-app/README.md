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

##After the Installation
- First we have to run the backend server by using the below command
  json-server --watch db.json --port 3001  #make sure to change which ever the port you need both in code and here
-Secondly do "npm start"

![image](https://github.com/user-attachments/assets/f914518d-3b64-41f4-9a83-900bdc85bf45)

  
![Screenshot 2025-05-21 084041](https://github.com/user-attachments/assets/6787095a-edb1-45e7-8645-faeb1934575d)


