import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Planet {
    sign: string;
    degree: number;
}

export interface Chart {
    id: number;
    name: string;
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    sunSign: string;
    moonSign: string;
    risingSign: string;
    planets: {
        sun: Planet;
        moon: Planet;
        mercury: Planet;
        venus: Planet;
        mars: Planet;
    };
}

export interface CalculateChartRequest {
    birthDate: string;
    birthTime: string;
    birthLocation: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getAllCharts(): Observable<Chart[]> {
        return this.http.get<Chart[]>(`${this.apiUrl}/charts`);
    }

    getChartById(id: number): Observable<Chart> {
        return this.http.get<Chart>(`${this.apiUrl}/charts/${id}`);
    }

    calculateChart(request: CalculateChartRequest): Observable<Chart> {
        return this.http.post<Chart>(`${this.apiUrl}/charts/calculate`, request);
    }

    initializeProject(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/init`);
    }
}

