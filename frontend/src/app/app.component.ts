import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from './services/workspace.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>ChatAndBuild.com</h1>
        <p class="subtitle">Collaborative Workspace Platform</p>
        <nav>
          <a routerLink="/task1" routerLinkActive="active">Task 1: Chat Messages</a>
          <a routerLink="/task2" routerLinkActive="active">Task 2: Create Workspace</a>
        </nav>
      </header>
      <main class="app-main">
        <div *ngIf="isInitializing" class="init-status">
          <p>Initializing project...</p>
        </div>
        <div *ngIf="initError" class="init-error">
          <p>⚠️ Initialization warning: {{ initError }}</p>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .app-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.8rem;
    }
    .app-header .subtitle {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    nav {
      display: flex;
      gap: 1rem;
    }
    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }
    nav a:hover, nav a.active {
      background: rgba(255,255,255,0.2);
    }
    .app-main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
    }
    .init-status {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }
    .init-error {
      background: #fff3cd;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border-left: 4px solid #ffc107;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'ChatAndBuild.com - Angular Assessment';
  isInitializing = true;
  initError: string | null = null;

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit() {
    this.initializeProject();
  }

  initializeProject() {
    this.isInitializing = true;
    this.workspaceService.initializeProject().subscribe({
      next: (response) => {
        this.isInitializing = false;
        console.log('Project initialized:', response);

        if (!response.success) {
          this.initError = response.message || 'Initialization completed with warnings';
        }

        // Log initialization details
        if (response.data) {
          console.log('Database:', response.data.database);
          console.log('Workspaces:', response.data.workspaces);
          console.log('Messages:', response.data.messages);
        }
      },
      error: (error) => {
        this.isInitializing = false;
        this.initError = 'Failed to initialize project. Please check backend connection.';
        console.error('Initialization error:', error);
      }
    });
  }
}

