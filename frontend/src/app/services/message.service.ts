import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
    _id: string;
    workspaceId: string;
    content: string;
    author: {
        name: string;
        userId?: string;
        avatar?: string;
    };
    type: 'text' | 'file' | 'system';
    metadata?: {
        fileName?: string;
        fileSize?: number;
        fileType?: string;
        fileUrl?: string;
    };
    editedAt?: string;
    isEdited?: boolean;
    reactions?: Array<{
        emoji: string;
        userId: string;
        createdAt: Date;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageRequest {
    content: string;
    author: {
        name: string;
        userId?: string;
        avatar?: string;
    };
    type?: 'text' | 'file' | 'system';
    metadata?: {
        fileName?: string;
        fileSize?: number;
        fileType?: string;
        fileUrl?: string;
    };
}

export interface MessageListResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Message[];
}

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getWorkspaceMessages(workspaceId: string, params?: {
        page?: number;
        limit?: number;
        before?: string;
        after?: string;
    }): Observable<MessageListResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key as keyof typeof params] !== undefined) {
                    httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
                }
            });
        }
        return this.http.get<MessageListResponse>(`${this.apiUrl}/workspaces/${workspaceId}/messages`, { params: httpParams });
    }

    sendMessage(workspaceId: string, request: SendMessageRequest): Observable<{ success: boolean; data: Message }> {
        return this.http.post<{ success: boolean; data: Message }>(`${this.apiUrl}/workspaces/${workspaceId}/messages`, request);
    }

    updateMessage(id: string, content: string): Observable<{ success: boolean; data: Message }> {
        return this.http.put<{ success: boolean; data: Message }>(`${this.apiUrl}/messages/${id}`, { content });
    }

    deleteMessage(id: string): Observable<{ success: boolean; data: {} }> {
        return this.http.delete<{ success: boolean; data: {} }>(`${this.apiUrl}/messages/${id}`);
    }
}
