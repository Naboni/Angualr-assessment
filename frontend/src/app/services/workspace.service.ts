import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    type: 'public' | 'private';
    createdBy?: string;
    members?: Array<{
        userId: string;
        role: 'owner' | 'admin' | 'member';
        joinedAt: Date;
    }>;
    createdAt: string;
    updatedAt: string;
    messageCount?: number;
}

export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
    type?: 'public' | 'private';
    createdBy?: string;
}

export interface WorkspaceListResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Workspace[];
}

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getAllWorkspaces(params?: {
        page?: number;
        limit?: number;
        type?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Observable<WorkspaceListResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key as keyof typeof params] !== undefined) {
                    httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
                }
            });
        }
        return this.http.get<WorkspaceListResponse>(`${this.apiUrl}/workspaces`, { params: httpParams });
    }

    getWorkspaceById(id: string): Observable<{ success: boolean; data: Workspace }> {
        return this.http.get<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces/${id}`);
    }

    createWorkspace(request: CreateWorkspaceRequest): Observable<{ success: boolean; data: Workspace }> {
        return this.http.post<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces`, request);
    }

    updateWorkspace(id: string, request: Partial<CreateWorkspaceRequest>): Observable<{ success: boolean; data: Workspace }> {
        return this.http.put<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces/${id}`, request);
    }

    deleteWorkspace(id: string): Observable<{ success: boolean; data: {} }> {
        return this.http.delete<{ success: boolean; data: {} }>(`${this.apiUrl}/workspaces/${id}`);
    }

    initializeProject(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/init`);
    }
}
