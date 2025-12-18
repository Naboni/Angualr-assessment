import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
// Optional: You can use the MessageService from services/message.service.ts instead of HttpClient directly
// import { MessageService, Message } from '../services/message.service';
// import { WorkspaceService, Workspace } from '../services/workspace.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 1 - Implement this component
// Requirements:
// 1. Fetch workspace messages from the API endpoint: GET /api/workspaces/:workspaceId/messages
//    - You can use a hardcoded workspace ID (e.g., get the first workspace from /api/workspaces)
// 2. Display messages in a simple list format
// 3. Each message should show:
//    - Message content
//    - Author name
//    - Timestamp (formatted date/time)
//    - Message type (text, file, system)
// 4. Add loading state while fetching data
// 5. Handle error states (show error message if API call fails)
// 6. Add basic styling to make it look clean and readable
//
// Note: MessageService and WorkspaceService are available in services/ if you prefer to use them

interface Message {
  _id: string;
  workspaceId: string;
  content: string;
  author: {
    name: string;
    userId?: string;
    avatar?: string;
  };
  type: 'text' | 'file' | 'system';
  createdAt: string;
  isEdited?: boolean;
}

interface Workspace {
  _id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
}

@Component({
  selector: 'app-task1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task1-container">
      <h2>Task 1: Workspace Chat Messages Display</h2>
      <p class="task-description">
        Fetch and display workspace chat messages from the API. 
        Show messages in a simple list with author name, content, timestamp, and message type.
      </p>
      
      <!-- TODO: Implement the messages display here -->
      <div class="placeholder">
        <p>Your implementation goes here...</p>
        <p class="hint">Display messages in a list format showing: content, author name, timestamp, and message type.</p>
      </div>
    </div>
  `,
  styles: [`
    .task1-container {
      max-width: 1200px;
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
export class Task1Component implements OnInit {
  messages: Message[] = [];           // Stores fetched messages
  workspace: Workspace | null = null; // Current workspace info
  loading: boolean = true;            // Shows loading spinner
  error: string | null = null;        // Stores error message if API fails
  currentPage: number = 1;            // Current page for pagination
  hasMore: boolean = true;            // Are there more messages to load?

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadWorkspaceAndMessages();
  }

  // Fetches workspaces, then fetches messages for the first workspace
  loadWorkspaceAndMessages() {
    this.loading = true;
    this.error = null;

    // Step 1: Fetch all workspaces to get the first one
    this.http.get<{ success: boolean; data: Workspace[] }>('/api/workspaces')
      .subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            // Got workspaces - save the first one
            this.workspace = response.data[0];
            // Now fetch messages for this workspace
            this.loadMessages(this.workspace._id);
          } else {
            // No workspaces found
            this.loading = false;
            this.error = 'No workspaces found. Create one in Task 2!';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to load workspaces. Please check if the backend is running.';
          console.error('Error fetching workspaces:', err);
        }
      });
  }

  // Fetches messages for a specific workspace
  loadMessages(workspaceId: string) {
    this.http.get<{ success: boolean; data: Message[]; page: number; pages: number }>(
      `/api/workspaces/${workspaceId}/messages`
    ).subscribe({
      next: (response) => {
        this.messages = response.data || [];
        this.currentPage = response.page;
        this.hasMore = response.page < response.pages;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load messages.';
        console.error('Error fetching messages:', err);
      }
    });
  }
}
