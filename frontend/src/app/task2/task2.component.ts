import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// Optional: You can use the WorkspaceService and MessageService from services/ instead of HttpClient directly
// import { WorkspaceService, Workspace, CreateWorkspaceRequest } from '../services/workspace.service';
// import { MessageService, SendMessageRequest } from '../services/message.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 2 - Implement this component
// Requirements:
// 1. Create a form with the following fields:
//    - Workspace Name (text input, required)
//    - Workspace Description (textarea, optional)
//    - Workspace Type (select: public/private, default: public)
// 2. Validate the workspace name field (required)
// 3. On form submit, send POST request to /api/workspaces
// 4. After successful workspace creation, show a message input form:
//    - Message Content (textarea, required)
//    - Message Type (select: text/file/system, default: text)
// 5. Send POST request to /api/workspaces/:id/messages when sending a message
// 6. Display success/error messages for both operations
// 7. Show loading state during API calls
// 8. Reset form after successful submission
//
// Note: WorkspaceService and MessageService are available in services/ if you prefer to use them

interface WorkspaceResult {
  _id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  createdAt: string;
}

interface MessageResult {
  _id: string;
  content: string;
  author: {
    name: string;
    userId?: string;
  };
  type: 'text' | 'file' | 'system';
  createdAt: string;
}

@Component({
  selector: 'app-task2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task2-container">
      <h2>Task 2: Create Workspace & Send Messages</h2>
      <p class="task-description">
        Create a form to create workspaces and send messages.
        Add basic validation and show success/error messages.
      </p>
      
      <!-- TODO: Implement the workspace creation form and message sending form here -->
      <div class="placeholder">
        <p>Your implementation goes here...</p>
        <p class="hint">Create a workspace first, then allow users to send messages to that workspace.</p>
      </div>
    </div>
  `,
  styles: [`
    .task2-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    .task-description {
      color: #666;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .placeholder {
      padding: 3rem;
      text-align: center;
      background: #f5f5f5;
      border-radius: 8px;
      color: #999;
    }
    .hint {
      font-size: 0.9rem;
      margin-top: 1rem;
      color: #aaa;
    }
  `]
})
export class Task2Component {
  // TODO: Add your implementation here
  // Suggested properties:
  // - workspaceForm: FormGroup;
  // - messageForm: FormGroup;
  // - createdWorkspace: WorkspaceResult | null = null;
  // - loading: boolean = false;
  // - error: string | null = null;
  // - success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // TODO: Initialize forms with validators
  }

  // TODO: Implement methods:
  // - createWorkspace(): void
  // - sendMessage(): void
  // - resetForms(): void
  // - Helper methods for validation and error handling
}
