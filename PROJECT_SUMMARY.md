# Project Summary

> ⚠️ **IMPORTANT: AI TOOLS ARE PROHIBITED**
> 
> **Candidates must NOT use AI tools such as Cursor, ChatGPT, GitHub Copilot, or any other AI coding assistants.**
> 
> **Use of AI tools will result in immediate failure of this assessment.**

## Overview
This assessment project is designed to evaluate candidates' Angular frontend development skills for ChatAndBuild.com. The project focuses on building a collaborative workspace platform with chat functionality. The backend is provided and mostly complete, allowing candidates to focus on frontend implementation including REST API integration, state management, routing, and performance optimization.

## Technology Stack

### Backend
- **Node.js** with Express
- **CORS** enabled for frontend communication
- **RESTful API** with workspace and message endpoints
- **WebSocket** support (Socket.io) for real-time features (optional)
- **MongoDB** with Mongoose ODM

### Frontend
- **Angular 17+** (standalone components)
- **Vite** as build tool
- **TypeScript** with strict typing
- **RxJS** for reactive programming and observables
- **Angular Router** for navigation and lazy loading
- **Angular Forms** (Reactive Forms with validation)
- **Angular HTTP Client** for API integration

## Assessment Tasks

### Task 1: Workspace Chat Messages Display
- **Complexity:** Low-Medium
- **Focus:** REST API integration, data display, error handling, basic UI
- **Estimated Time:** 1-2 hours
- **Key Skills Tested:**
  - HTTP client usage and error handling
  - Component lifecycle and state management
  - Basic CSS styling
  - TypeScript interfaces and type safety

### Task 2: Create Workspace & Send Messages
- **Complexity:** Low-Medium
- **Focus:** Form handling, basic validation, API integration, user feedback
- **Estimated Time:** 1-2 hours
- **Key Skills Tested:**
  - Reactive forms with basic validation
  - HTTP POST requests and error handling
  - User feedback (loading, errors, success states)
  - TypeScript best practices

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/workspaces` | Get all workspaces (with pagination) |
| GET | `/api/workspaces/:id` | Get workspace by ID |
| POST | `/api/workspaces` | Create new workspace |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |
| GET | `/api/workspaces/:id/messages` | Get workspace messages (with pagination) |
| POST | `/api/workspaces/:id/messages` | Send message to workspace |
| PUT | `/api/messages/:id` | Update message |
| DELETE | `/api/messages/:id` | Delete message |

## File Structure

```
.
├── backend/
│   ├── server.js           # Express API (complete)
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts      # Main app component
│   │   │   ├── app.routes.ts         # Routing configuration
│   │   │   ├── task1/
│   │   │   │   └── task1.component.ts  # Task 1: Chat Messages (to implement)
│   │   │   ├── task2/
│   │   │   │   └── task2.component.ts  # Task 2: Create Workspace (to implement)
│   │   │   └── services/
│   │   │       ├── workspace.service.ts    # Workspace API service
│   │   │       └── message.service.ts      # Message API service
│   │   ├── main.ts                    # Application bootstrap
│   │   └── styles.css                 # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── README.md
├── ASSESSMENT_INSTRUCTIONS.md
├── QUICK_START.md
└── PROJECT_SUMMARY.md (this file)
```

## Evaluation Criteria

1. **Code Quality** (30%)
   - Clean, readable code
   - Proper TypeScript usage with type safety
   - Component organization

2. **Functionality** (40%)
   - All requirements met
   - Error handling
   - Loading and success states
   - Basic form validation

3. **User Experience** (20%)
   - Basic styling and layout
   - User feedback (loading, errors, success)

4. **Best Practices** (10%)
   - Angular patterns (reactive forms, HTTP client, lifecycle hooks)
   - Type safety and interfaces

## Notes for Reviewers

- Backend is intentionally simple - it's a mock API for workspace and message management
- Candidates can use the provided services or implement their own HTTP calls
- Styling approach is flexible (CSS, SCSS, Tailwind, Angular Material, etc.)
- Focus should be on completing core functionality with clean, readable code
- Keep requirements simple - candidates should focus on basic Angular skills

## Expected Deliverables

1. Completed `task1.component.ts` with full chat messages display implementation
2. Completed `task2.component.ts` with full workspace creation and messaging implementation
3. Updated or new service files for API integration
4. Unit tests for components and services (optional but recommended)
5. Git repository with meaningful commit history
6. Brief summary of implementation approach, design decisions, and any additional features (optional but recommended)

