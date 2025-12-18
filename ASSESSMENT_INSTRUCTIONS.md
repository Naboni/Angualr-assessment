# Assessment Instructions for Candidates

> ⚠️ **CRITICAL: DO NOT USE AI TOOLS**
> 
> **You MUST complete this assessment WITHOUT using AI tools such as Cursor, ChatGPT, GitHub Copilot, or any other AI coding assistants.**
> 
> **Using AI tools will result in IMMEDIATE FAILURE of this assessment.**
> 
> This assessment evaluates your personal skills and knowledge. AI assistance is strictly prohibited.

Welcome to the ChatAndBuild.com Angular Frontend Developer assessment! This project contains two frontend tasks that should be completed within 1-2 days. You'll be building features for a collaborative workspace platform with chat functionality.

## Quick Start

1. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   The API will run on `http://localhost:3000`

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The app will run on `http://localhost:4200`

3. **Navigate to Tasks:**
   - Task 1: http://localhost:4200/task1
   - Task 2: http://localhost:4200/task2

## Task Overview

### Task 1: Workspace Chat Messages Display
Create a component that fetches and displays workspace chat messages from the API. Display messages in a simple list format. See `frontend/src/app/task1/task1.component.ts` for detailed requirements.

**Key Focus Areas:**
- REST API integration with error handling
- Basic UI to display messages
- Loading and error states
- TypeScript interfaces

### Task 2: Create Workspace & Send Messages
Create a form component that allows users to create workspaces and send messages. Add basic validation and user feedback. See `frontend/src/app/task2/task2.component.ts` for detailed requirements.

**Key Focus Areas:**
- Reactive forms with basic validation
- HTTP POST requests
- Loading states, error handling, and success feedback

## What We're Looking For

> ⚠️ **REMINDER: AI tools are strictly prohibited. Using Cursor, ChatGPT, GitHub Copilot, or similar tools will result in failure.**

- **Code Quality**: Clean, readable code following Angular best practices
- **API Integration**: Proper REST API consumption with error handling and loading states
- **User Experience**: Basic UI with loading, error, and success states
- **TypeScript**: Proper use of interfaces and type safety

## Tips

- ⚠️ **Remember: AI tools are prohibited. This assessment tests YOUR skills.**
- Read the TODO comments in each component file carefully
- The backend API is ready to use - focus on frontend implementation
- Keep it simple - focus on core functionality first
- Add basic styling to make it look clean and readable

Good luck!

