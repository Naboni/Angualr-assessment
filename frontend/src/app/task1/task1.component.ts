import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="task1-container">
      <h2>Task 1: Workspace Chat Messages Display</h2>
      <p class="task-description">
        Fetch and display workspace chat messages from the API. 
        Show messages in a simple list with author name, content, timestamp, and message type.
      </p>
      
      <!-- Loading State - Skeleton -->
      <div *ngIf="loading" class="skeleton-container">
        <div class="skeleton-header">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-badge"></div>
        </div>
        <div class="skeleton-messages">
          <div *ngFor="let i of [1, 2, 3, 4]" class="skeleton-message">
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton-body">
              <div class="skeleton-row">
                <div class="skeleton skeleton-name"></div>
                <div class="skeleton skeleton-type"></div>
                <div class="skeleton skeleton-time"></div>
              </div>
              <div class="skeleton skeleton-content"></div>
              <div class="skeleton skeleton-content short"></div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button (click)="loadWorkspaceAndMessages()">Try Again</button>
      </div>

      <div *ngIf="!loading && !error" class="messages-container">
        <div *ngIf="workspaces.length > 1" class="workspace-selector">
          <label for="workspace-select">Switch Workspace:</label>
          <select 
            id="workspace-select"
            [(ngModel)]="selectedWorkspaceId"
            (ngModelChange)="switchWorkspace($event)">
            <option *ngFor="let ws of workspaces" [value]="ws._id">
              {{ ws.name }} ({{ ws.type }})
            </option>
          </select>
        </div>

        <div *ngIf="workspace" class="workspace-header">
          <h3>{{ workspace.name }}</h3>
          <span class="workspace-type">{{ workspace.type }}</span>
          <span class="message-count">{{ totalMessages }} {{ totalMessages === 1 ? 'message' : 'messages' }}</span>
        </div>

        <div class="refresh-controls">
          <button 
            class="refresh-btn" 
            (click)="toggleAutoRefresh()"
            [class.active]="autoRefreshEnabled">
            {{ autoRefreshEnabled ? 'Pause' : 'Resume' }} Auto-refresh
          </button>
          <button class="refresh-btn manual" (click)="refreshMessages()">
            Refresh Now
          </button>
          <span class="last-updated">
            Last updated: {{ formatDate(lastRefreshed.toISOString()) }}
          </span>
        </div>

        <div class="search-container">
          <input 
            type="text" 
            class="search-input"
            placeholder="Search messages or authors..."
            [(ngModel)]="searchTerm"
          />
          <span *ngIf="searchTerm" class="search-results">
            Found {{ filteredMessages.length }} of {{ messages.length }}
          </span>
          <button *ngIf="searchTerm" class="clear-search" (click)="searchTerm = ''">
            Clear
          </button>
        </div>

        <div *ngIf="messages.length === 0" class="empty-state">
          <p>No messages yet. Be the first to send a message!</p>
        </div>

        <div class="messages-list" #messagesContainer (scroll)="onMessagesScroll($event)">
          <ng-container *ngFor="let message of filteredMessages; let i = index">
            <div *ngIf="shouldShowDateSeparator(i)" class="date-separator">
              <span class="date-label">{{ getDateGroup(message.createdAt) }}</span>
            </div>
            
            <div class="message-item">
              <div class="avatar" [style.background-color]="getAvatarColor(message.author.name)">
                {{ getInitials(message.author.name) }}
              </div>
              <div class="message-body">
                <div class="message-header">
                  <span class="author">{{ message.author.name }}</span>
                  <span class="message-type" [class]="message.type">{{ message.type }}</span>
                  <span class="timestamp">{{ formatDate(message.createdAt) }}</span>
                </div>
                <div class="message-content">
                  {{ message.content }}
                </div>
              </div>
            </div>
          </ng-container>
        </div>

        <button 
          *ngIf="showScrollButton && messages.length > 0" 
          class="scroll-btn"
          (click)="scrollToBottom()"
          title="Scroll to latest messages">
          Jump to Latest
        </button>

        <div *ngIf="messages.length > 0" class="load-more-container">
          <button 
            *ngIf="hasMore" 
            class="load-more-btn" 
            (click)="loadMoreMessages()"
            [disabled]="loadingMore">
            {{ loadingMore ? 'Loading...' : 'Load More Messages' }}
          </button>
          <p *ngIf="!hasMore" class="no-more-messages">
            All messages loaded
          </p>
        </div>

        <div class="send-message-container">
            <div class="send-message-header">
              <span>New Message</span>
            </div>
          
          <div class="send-input-row">
            <label for="authorName">Your Name:</label>
            <input 
              type="text" 
              id="authorName"
              class="author-input"
              [(ngModel)]="authorName"
              placeholder="Enter your name"
            />
          </div>
          
          <div class="send-input-row message-row">
            <textarea 
              class="message-textarea"
              [(ngModel)]="newMessageContent"
              placeholder="Type your message here..."
              rows="3"
              (keydown.enter)="$event.ctrlKey && sendMessage()"
            ></textarea>
            <button 
              class="send-btn"
              (click)="sendMessage()"
              [disabled]="sending || !newMessageContent.trim()">
              {{ sending ? 'Sending...' : 'Send' }}
            </button>
          </div>
          
          <p class="send-hint">Press Ctrl+Enter to send</p>
          
            <div *ngIf="sendSuccess" class="send-success">
              {{ sendSuccess }}
            </div>
            <div *ngIf="sendError" class="send-error">
              {{ sendError }}
            </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .task1-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1rem;
    }

    .task-description {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    /* Skeleton Loading */
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e0e0e0 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-container {
      padding: 1rem 0;
    }

    .skeleton-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .skeleton-title {
      width: 200px;
      height: 28px;
    }

    .skeleton-badge {
      width: 70px;
      height: 24px;
      border-radius: 999px;
    }

    .skeleton-messages {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-message {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .skeleton-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .skeleton-body {
      flex: 1;
    }

    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .skeleton-name {
      width: 120px;
      height: 16px;
    }

    .skeleton-type {
      width: 50px;
      height: 16px;
    }

    .skeleton-time {
      width: 80px;
      height: 14px;
      margin-left: auto;
    }

    .skeleton-content {
      width: 100%;
      height: 16px;
      margin-bottom: 0.5rem;
    }

    .skeleton-content.short {
      width: 60%;
    }

    /* Error State */
    .error {
      background: #fee2e2;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      color: #dc2626;
    }

    .error button {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .error button:hover {
      background: #b91c1c;
    }

    /* Workspace Selector */
    .workspace-selector {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .workspace-selector label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #475569;
    }

    .workspace-selector select {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: white;
      font-size: 0.95rem;
      color: #334155;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .workspace-selector select:focus {
      outline: none;
      border-color: #0d9488;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.15);
    }

    .workspace-selector select:hover {
      border-color: #94a3b8;
    }

    /* Workspace Header */
    .workspace-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .workspace-header h3 {
      margin: 0;
      font-size: 1.4rem;
      color: #1f2937;
    }

    .workspace-type {
      padding: 0.2rem 0.6rem;
      background: #f0fdfa;
      color: #0f766e;
      border-radius: 3px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .message-count {
      margin-left: auto;
      padding: 0.25rem 0.75rem;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Refresh Controls */
    .refresh-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 8px;
      flex-wrap: wrap;
    }

    .refresh-btn {
      padding: 0.4rem 0.8rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      color: #374151;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .refresh-btn:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .refresh-btn.active {
      background: #f0fdfa;
      border-color: #5eead4;
      color: #0f766e;
    }

    .refresh-btn.manual {
      background: #fff;
      border-color: #0d9488;
      color: #0d9488;
    }

    .refresh-btn.manual:hover {
      background: #f0fdfa;
    }

    .last-updated {
      margin-left: auto;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    /* Search Box */
    .search-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #0d9488;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .search-results {
      font-size: 0.85rem;
      color: #6b7280;
      white-space: nowrap;
    }

    .clear-search {
      padding: 0.5rem 0.75rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #6b7280;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-search:hover {
      background: #e5e7eb;
      color: #374151;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem;
      background: #f9fafb;
      border-radius: 8px;
      color: #6b7280;
    }

    /* Messages Container */
    .messages-container {
      position: relative;
    }

    /* Messages List - Scrollable */
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 450px;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    /* Custom Scrollbar */
    .messages-list::-webkit-scrollbar {
      width: 8px;
    }

    .messages-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .messages-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .messages-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Scroll to Bottom Button */
    .scroll-btn {
      position: sticky;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin: 0.75rem auto;
      display: block;
      padding: 0.5rem 1rem;
      background: #0d9488;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
      transition: all 0.15s;
      z-index: 10;
    }

    .scroll-btn:hover {
      transform: translateX(-50%) translateY(-1px);
      background: #0f766e;
    }

    /* Date Separator */
    .date-separator {
      display: flex;
      align-items: center;
      margin: 0.5rem 0;
    }

    .date-separator::before,
    .date-separator::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    }

    .date-label {
      padding: 0.25rem 1rem;
      background: #f8fafc;
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 999px;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .message-item {
      display: flex;
      gap: 1rem;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      transition: box-shadow 0.2s;
    }

    .message-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .message-body {
      flex: 1;
      min-width: 0;
    }

    .message-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .author {
      font-weight: 600;
      color: #1f2937;
    }

    .message-type {
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .message-type.text {
      background: #ecfeff;
      color: #0e7490;
    }

    .message-type.file {
      background: #fef9c3;
      color: #a16207;
    }

    .message-type.system {
      background: #f1f5f9;
      color: #64748b;
    }

    .timestamp {
      margin-left: auto;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .message-content {
      color: #374151;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    /* Load More */
    .load-more-container {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .load-more-btn {
      padding: 0.6rem 1.5rem;
      background: #fff;
      color: #0d9488;
      border: 2px solid #0d9488;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .load-more-btn:hover:not(:disabled) {
      background: #0d9488;
      color: white;
    }

    .load-more-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .no-more-messages {
      color: #9ca3af;
      font-size: 0.9rem;
      font-style: italic;
    }

    /* Send Message Form */
    .send-message-container {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
    }

    .send-message-header {
      margin-bottom: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: #525252;
    }

    .send-input-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .send-input-row label {
      font-size: 0.9rem;
      color: #64748b;
      white-space: nowrap;
    }

    .author-input {
      flex: 1;
      max-width: 250px;
      padding: 0.5rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .author-input:focus {
      outline: none;
      border-color: #0d9488;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
    }

    .message-row {
      align-items: flex-end;
    }

    .message-textarea {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.95rem;
      font-family: inherit;
      resize: vertical;
      min-height: 60px;
      transition: all 0.2s;
    }

    .message-textarea:focus {
      outline: none;
      border-color: #0d9488;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
    }

    .message-textarea::placeholder {
      color: #94a3b8;
    }

    .send-btn {
      padding: 0.65rem 1.25rem;
      background: #0d9488;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }

    .send-btn:hover:not(:disabled) {
      background: #0f766e;
    }

    .send-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .send-hint {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .send-success {
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: #dcfce7;
      color: #166534;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .send-error {
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
    }

  `]
})
export class Task1Component implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  messages: Message[] = [];
  workspace: Workspace | null = null;
  workspaces: Workspace[] = [];
  selectedWorkspaceId: string = '';
  loading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  hasMore: boolean = true;
  totalMessages: number = 0;
  
  private refreshInterval: any = null;
  refreshSeconds: number = 30;
  lastRefreshed: Date = new Date();
  autoRefreshEnabled: boolean = true;
  loadingMore: boolean = false;
  searchTerm: string = '';
  showScrollButton: boolean = false;
  newMessageContent: string = '';
  authorName: string = 'Anonymous User';
  sending: boolean = false;
  sendSuccess: string | null = null;
  sendError: string | null = null;

  constructor(private http: HttpClient) { }

  get filteredMessages(): Message[] {
    if (!this.searchTerm.trim()) {
      return this.messages;
    }
    
    const search = this.searchTerm.toLowerCase();
    return this.messages.filter(message => 
      message.content.toLowerCase().includes(search) ||
      message.author.name.toLowerCase().includes(search)
    );
  }

  ngOnInit() {
    this.loadWorkspaceAndMessages();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    if (this.refreshInterval) return;
    
    this.refreshInterval = setInterval(() => {
      if (this.autoRefreshEnabled && this.workspace && !this.loading) {
        this.refreshMessages();
      }
    }, this.refreshSeconds * 1000);
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  refreshMessages() {
    if (!this.workspace) return;
    
    this.http.get<{ success: boolean; data: Message[]; page: number; pages: number; total: number }>(
      `/api/workspaces/${this.workspace._id}/messages`
    ).subscribe({
      next: (response) => {
        this.messages = response.data || [];
        this.totalMessages = response.total || this.messages.length;
        this.lastRefreshed = new Date();
      },
      error: (err) => {
        console.error('Error refreshing messages:', err);
      }
    });
  }

  toggleAutoRefresh() {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
  }

  switchWorkspace(workspaceId: string) {
    const selected = this.workspaces.find(w => w._id === workspaceId);
    if (selected && selected._id !== this.workspace?._id) {
      this.workspace = selected;
      this.selectedWorkspaceId = workspaceId;
      localStorage.setItem('selectedWorkspaceId', workspaceId);
      this.messages = [];
      this.searchTerm = '';
      this.currentPage = 1;
      this.hasMore = true;
      this.loading = true;
      this.loadMessages(workspaceId);
    }
  }

  loadMoreMessages() {
    if (!this.workspace || this.loadingMore || !this.hasMore) return;
    
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    
    this.http.get<{ success: boolean; data: Message[]; page: number; pages: number; total: number }>(
      `/api/workspaces/${this.workspace._id}/messages?page=${nextPage}`
    ).subscribe({
      next: (response) => {
        this.messages = [...this.messages, ...(response.data || [])];
        this.currentPage = response.page;
        this.hasMore = response.page < response.pages;
        this.totalMessages = response.total || this.messages.length;
        this.loadingMore = false;
      },
      error: (err) => {
        this.loadingMore = false;
        console.error('Error loading more messages:', err);
      }
    });
  }

  loadWorkspaceAndMessages() {
    this.loading = true;
    this.error = null;

    const DEFAULT_WORKSPACE_ID = '694402bd45836b0654a07989';
    const savedWorkspaceId = localStorage.getItem('selectedWorkspaceId');

    this.http.get<{ success: boolean; data: Workspace[] }>('/api/workspaces')
      .subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            this.workspaces = response.data;
            
            // Priority: saved > default > first
            const targetId = savedWorkspaceId || DEFAULT_WORKSPACE_ID;
            const targetWorkspace = response.data.find(w => w._id === targetId);
            
            this.workspace = targetWorkspace || response.data[0];
            this.selectedWorkspaceId = this.workspace._id;
            this.loadMessages(this.workspace._id);
          } else {
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

  loadMessages(workspaceId: string) {
    this.http.get<{ success: boolean; data: Message[]; page: number; pages: number; total: number }>(
      `/api/workspaces/${workspaceId}/messages`
    ).subscribe({
      next: (response) => {
        this.messages = response.data || [];
        this.currentPage = response.page;
        this.hasMore = response.page < response.pages;
        this.totalMessages = response.total || this.messages.length;
        this.loading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load messages.';
        console.error('Error fetching messages:', err);
      }
    });
  }

  sendMessage() {
    if (!this.workspace || !this.newMessageContent.trim()) return;
    
    this.sending = true;
    this.sendError = null;
    this.sendSuccess = null;
    
    const messageData = {
      content: this.newMessageContent.trim(),
      author: {
        name: this.authorName || 'Anonymous User'
      },
      type: 'text'
    };
    
    this.http.post<{ success: boolean; data: Message }>(
      `/api/workspaces/${this.workspace._id}/messages`,
      messageData
    ).subscribe({
      next: (response) => {
        if (response.data) {
          this.messages = [...this.messages, response.data];
          this.totalMessages++;
        }
        this.newMessageContent = '';
        this.sending = false;
        this.sendSuccess = 'Message sent!';
        this.lastRefreshed = new Date();
        
        setTimeout(() => this.scrollToBottom(), 100);
        setTimeout(() => { this.sendSuccess = null; }, 3000);
      },
      error: (err) => {
        this.sending = false;
        this.sendError = 'Failed to send message. Please try again.';
        console.error('Error sending message:', err);
        setTimeout(() => { this.sendError = null; }, 5000);
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399',
      '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#e879f9'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 2) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  onMessagesScroll(event: Event) {
    const container = event.target as HTMLElement;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    this.showScrollButton = distanceFromBottom > 100;
  }

  getDateGroup(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  shouldShowDateSeparator(index: number): boolean {
    const messages = this.filteredMessages;
    if (index === 0) return true;
    
    const currentDate = this.getDateGroup(messages[index].createdAt);
    const previousDate = this.getDateGroup(messages[index - 1].createdAt);
    
    return currentDate !== previousDate;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return diffInMinutes === 1 ? '1 min ago' : `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;

    return date.toLocaleDateString();
  }
}
