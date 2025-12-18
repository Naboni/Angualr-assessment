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

      <div *ngIf="error" class="error-message">
        {{ error }}
        <button class="dismiss-btn" (click)="error = null">×</button>
      </div>

      <div *ngIf="success" class="success-message">
        {{ success }}
        <button class="dismiss-btn" (click)="success = null">×</button>
      </div>

      <!-- Step 1: Create Workspace Form -->
      <div class="form-card" *ngIf="!createdWorkspace">
        <div class="form-header">
          <span class="step-number">1</span>
          <h3>Create a Workspace</h3>
        </div>

        <form [formGroup]="workspaceForm" (ngSubmit)="createWorkspace()">
          <div class="form-group">
            <label for="name">Workspace Name *</label>
            <input 
              type="text" 
              id="name"
              formControlName="name"
              placeholder="Enter workspace name"
              [class.invalid]="isFieldInvalid(workspaceForm, 'name')"
            />
            <span *ngIf="isFieldInvalid(workspaceForm, 'name')" class="field-error">
              {{ getFieldError(workspaceForm, 'name') }}
            </span>
          </div>

          <div class="form-group">
            <label for="description">Description (optional)</label>
            <textarea 
              id="description"
              formControlName="description"
              placeholder="Enter workspace description"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="type">Workspace Type</label>
            <select id="type" formControlName="type">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            [disabled]="workspaceForm.invalid || loading">
            {{ loading ? 'Creating...' : 'Create Workspace' }}
          </button>
        </form>
      </div>

      <!-- Step 2: Workspace Created - Show Message Form -->
      <div *ngIf="createdWorkspace">
        <div class="workspace-info-card">
          <div class="workspace-info-header">
            <span class="check-icon">OK</span>
            <div>
              <h4>{{ createdWorkspace.name }}</h4>
              <span class="workspace-type-badge">{{ createdWorkspace.type }}</span>
            </div>
          </div>
          <p *ngIf="createdWorkspace.description" class="workspace-description">
            {{ createdWorkspace.description }}
          </p>
          <button class="reset-btn" (click)="resetForms()">
            ← Create Another Workspace
          </button>
        </div>

        <div class="form-card">
          <div class="form-header">
            <span class="step-number">2</span>
            <h3>Send a Message</h3>
          </div>

          <form [formGroup]="messageForm" (ngSubmit)="sendMessage()">
            <div class="form-group">
              <label for="authorName">Your Name *</label>
              <input 
                type="text" 
                id="authorName"
                formControlName="authorName"
                placeholder="Enter your name"
                [class.invalid]="isFieldInvalid(messageForm, 'authorName')"
              />
              <span *ngIf="isFieldInvalid(messageForm, 'authorName')" class="field-error">
                {{ getFieldError(messageForm, 'authorName') }}
              </span>
            </div>

            <div class="form-group">
              <label for="content">Message *</label>
              <textarea 
                id="content"
                formControlName="content"
                placeholder="Type your message here..."
                rows="4"
                [class.invalid]="isFieldInvalid(messageForm, 'content')"
              ></textarea>
              <span *ngIf="isFieldInvalid(messageForm, 'content')" class="field-error">
                {{ getFieldError(messageForm, 'content') }}
              </span>
            </div>

            <div class="form-group">
              <label for="messageType">Message Type</label>
              <select id="messageType" formControlName="type">
                <option value="text">Text</option>
                <option value="file">File</option>
                <option value="system">System</option>
              </select>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              [disabled]="messageForm.invalid || loading">
              {{ loading ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>

        <div *ngIf="sentMessages.length > 0" class="sent-messages">
          <h4>Sent Messages ({{ sentMessages.length }})</h4>
          <div *ngFor="let msg of sentMessages" class="sent-message-item">
            <div class="sent-message-header">
              <span class="sent-author">{{ msg.author.name }}</span>
              <span class="sent-type">{{ msg.type }}</span>
            </div>
            <p class="sent-content">{{ msg.content }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task2-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }

    .task-description {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    /* Alert Messages */
    .error-message, .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid #fca5a5;
    }

    .success-message {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
    }

    .dismiss-btn {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.6;
      color: inherit;
    }

    .dismiss-btn:hover {
      opacity: 1;
    }

    /* Form Card */
    .form-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1.25rem;
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .step-number {
      width: 28px;
      height: 28px;
      background: #0d9488;
      color: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .form-header h3 {
      margin: 0;
      color: #1f2937;
      font-size: 1.2rem;
    }

    /* Form Groups */
    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.95rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 0.65rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #0d9488;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
    }

    .form-group input.invalid,
    .form-group textarea.invalid {
      border-color: #dc2626;
    }

    .form-group input.invalid:focus,
    .form-group textarea.invalid:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }

    .field-error {
      display: block;
      margin-top: 0.5rem;
      color: #dc2626;
      font-size: 0.85rem;
    }

    /* Submit Button */
    .submit-btn {
      width: 100%;
      padding: 0.75rem;
      background: #0d9488;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
    }

    .submit-btn:hover:not(:disabled) {
      background: #0f766e;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Workspace Info Card */
    .workspace-info-card {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .workspace-info-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .check-icon {
      width: 24px;
      height: 24px;
      background: #0d9488;
      color: white;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .workspace-info-header h4 {
      margin: 0;
      color: #0f766e;
      font-size: 1rem;
    }

    .workspace-type-badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      background: #ccfbf1;
      color: #0f766e;
      border-radius: 3px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 0.5rem;
    }

    .workspace-description {
      margin: 0.75rem 0;
      color: #115e59;
      font-size: 0.9rem;
    }

    .reset-btn {
      background: none;
      border: none;
      color: #0d9488;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }

    .reset-btn:hover {
      opacity: 1;
    }

    /* Sent Messages List */
    .sent-messages {
      margin-top: 1.25rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .sent-messages h4 {
      margin: 0 0 0.75rem 0;
      color: #475569;
      font-size: 0.9rem;
    }

    .sent-message-item {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .sent-message-item:last-child {
      margin-bottom: 0;
    }

    .sent-message-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .sent-author {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.9rem;
    }

    .sent-type {
      padding: 0.1rem 0.4rem;
      background: #e0e7ff;
      color: #4338ca;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .sent-content {
      margin: 0;
      color: #4b5563;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  `]
})
export class Task2Component {
  workspaceForm: FormGroup;
  messageForm: FormGroup;
  createdWorkspace: WorkspaceResult | null = null;
  sentMessages: MessageResult[] = [];
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.workspaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['public']
    });

    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]],
      authorName: ['Anonymous User', Validators.required],
      type: ['text']
    });
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid input';
  }

  createWorkspace(): void {
    if (this.workspaceForm.invalid) {
      this.workspaceForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const payload = this.workspaceForm.value;

    this.http.post<{ success: boolean; data: WorkspaceResult }>('/api/workspaces', payload).subscribe({
      next: (response) => {
        this.createdWorkspace = response.data;
        this.success = `Workspace "${response.data.name}" created successfully!`;
        this.loading = false;
        this.workspaceForm.reset({ type: 'public' });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create workspace';
        this.loading = false;
      }
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid || !this.createdWorkspace) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const payload = {
      content: this.messageForm.value.content,
      author: {
        name: this.messageForm.value.authorName
      },
      type: this.messageForm.value.type
    };

    this.http.post<{ success: boolean; data: MessageResult }>(
      `/api/workspaces/${this.createdWorkspace._id}/messages`,
      payload
    ).subscribe({
      next: (response) => {
        this.sentMessages.push(response.data);
        this.success = 'Message sent successfully!';
        this.loading = false;
        this.messageForm.patchValue({ content: '' });
        this.messageForm.get('content')?.markAsUntouched();
        this.messageForm.get('content')?.markAsPristine();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to send message';
        this.loading = false;
      }
    });
  }

  resetForms(): void {
    this.createdWorkspace = null;
    this.sentMessages = [];
    this.error = null;
    this.success = null;
    this.workspaceForm.reset({ type: 'public' });
    this.messageForm.reset({ authorName: 'Anonymous User', type: 'text' });
  }
}
