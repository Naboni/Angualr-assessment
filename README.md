# ChatAndBuild.com - Angular Frontend Developer Assessment

> ⚠️ **IMPORTANT: DO NOT USE AI TOOLS**
> 
> **This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, GitHub Copilot, or any other AI coding assistants.**
> 
> **If you use AI tools to complete this assessment, you will FAIL.**
> 
> This assessment is designed to evaluate your personal coding skills, problem-solving abilities, and understanding of Angular and TypeScript. Using AI tools defeats the purpose of this assessment and will result in immediate disqualification.

This is an assessment project for Angular Frontend Developer candidates at ChatAndBuild.com. The project consists of a Node.js backend (mostly complete) and an Angular frontend with two tasks to complete. This assessment evaluates your ability to build responsive, performant UI components, integrate with REST APIs, implement state management, and create a modern collaborative workspace interface.

## Project Structure

```
.
├── backend/          # Node.js/Express API (mostly complete)
├── frontend/         # Angular application with Vite (tasks to complete)
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/terri-quintel-astrology
```

5. Seed the database with sample data (optional):
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:4200`

## API Endpoints

The backend provides the following endpoints:

### Core Workspace Endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/workspaces` - Get all workspaces (supports pagination, filtering, sorting)
- `GET /api/workspaces/:id` - Get a specific workspace by ID
- `POST /api/workspaces` - Create a new workspace
- `PUT /api/workspaces/:id` - Update a workspace
- `DELETE /api/workspaces/:id` - Delete a workspace

### Message Endpoints
- `GET /api/workspaces/:workspaceId/messages` - Get messages for a workspace (supports pagination)
- `POST /api/workspaces/:workspaceId/messages` - Send a new message to a workspace
- `PUT /api/messages/:id` - Update a message
- `DELETE /api/messages/:id` - Delete a message

### Additional Endpoints
- `GET /api/workspaces/:id/members` - Get workspace members
- `GET /api/workspaces/stats/summary` - Get workspace statistics
- `GET /api/workspaces/search?q=query` - Search workspaces

### Query Parameters (for GET /api/workspaces)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `type` - Filter by workspace type (public/private)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

### Query Parameters (for GET /api/workspaces/:id/messages)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `before` - Get messages before this timestamp
- `after` - Get messages after this timestamp

### WebSocket Support (Optional)
- `ws://localhost:3000` - WebSocket connection for real-time message updates
- Events: `message:new`, `message:updated`, `message:deleted`, `workspace:updated`

See `backend/README.md` for detailed API documentation.

## Assessment Tasks

### Task 1: Workspace Chat Messages Display

**Location:** `frontend/src/app/task1/task1.component.ts`

**Requirements:**
1. Fetch workspace messages from the API endpoint: `GET /api/workspaces/:workspaceId/messages`
2. Display messages in a simple list format
3. Each message should show:
   - Message content
   - Author name
   - Timestamp (formatted date/time)
   - Message type (text, file, system)
4. Add loading state while fetching data
5. Handle error states (show error message if API call fails)
6. Add basic styling to make it look clean and readable

**Expected Time:** 1-2 hours

**Key Skills Evaluated:**
- REST API integration
- Component lifecycle management
- Error handling and loading states
- TypeScript interfaces and type safety

### Task 2: Create Workspace & Send Messages

**Location:** `frontend/src/app/task2/task2.component.ts`

**Requirements:**
1. Create a form with the following fields:
   - Workspace Name (text input, required)
   - Workspace Description (textarea, optional)
   - Workspace Type (select: public/private)
2. Validate the workspace name field (required)
3. On form submit, send POST request to `/api/workspaces`
4. After successful workspace creation, show a message input form:
   - Message Content (textarea, required)
   - Message Type (select: text/file/system)
5. Send POST request to `/api/workspaces/:id/messages` when sending a message
6. Display success/error messages for both operations
7. Show loading state during API calls
8. Reset form after successful submission

**Expected Time:** 1-2 hours

**Key Skills Evaluated:**
- Reactive forms and basic validation
- HTTP POST requests
- User feedback (loading, errors, success)
- TypeScript best practices

## Evaluation Criteria

> ⚠️ **REMINDER: Using AI tools (Cursor, ChatGPT, GitHub Copilot, etc.) will result in immediate failure of this assessment.**

Candidates will be evaluated on:

1. **Code Quality**
   - Clean, readable code
   - Proper TypeScript usage
   - Component structure

2. **Functionality**
   - All requirements are met
   - Proper error handling
   - Loading states implemented

3. **User Experience**
   - Basic styling and layout
   - Good user feedback (loading, errors, success)

4. **Best Practices**
   - Proper use of Angular features (reactive forms, HTTP client, etc.)
   - Component lifecycle management
   - Type safety

## Submission

> ⚠️ **FINAL WARNING: Do NOT use AI tools. Your submission will be reviewed, and use of AI tools will result in immediate disqualification.**

Please submit your completed assessment by:
1. Pushing your code to a Git repository (GitHub, GitLab, etc.)
2. Sharing the repository link
3. Including a brief summary of your implementation approach

## Backend Architecture

The backend follows a clean MVC architecture:
- **Models**: Mongoose schemas (`models/Workspace.js`, `models/Message.js`)
- **Controllers**: Business logic (`controllers/workspaceController.js`, `controllers/messageController.js`)
- **Routes**: API endpoints (`routes/workspaceRoutes.js`, `routes/messageRoutes.js`)
- **Middleware**: Validation and error handling
- **Database**: MongoDB with Mongoose ODM
- **WebSocket**: Socket.io for real-time features (optional)

See `backend/README.md` for detailed backend documentation.

## Notes

- ⚠️ **DO NOT USE AI TOOLS** - Using Cursor, ChatGPT, GitHub Copilot, or any AI coding assistants will result in immediate failure
- The backend uses MongoDB for data persistence - make sure MongoDB is running before starting the server
- The backend is mostly complete - focus your efforts on the frontend tasks
- Keep it simple - focus on completing the core requirements
- You can use any Angular libraries or styling approaches you prefer (CSS, SCSS, Tailwind, Angular Material, etc.)
- The deadline for completion is 1 day from when you receive this assessment

## Questions?

If you have any questions about the assessment, please don't hesitate to reach out.

Good luck!

