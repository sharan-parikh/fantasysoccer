import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface PlayerInfo {
  id: number;
  name: string;
  cost: number;
  totalPoints: number;
  position: string;
  realteamName: string;
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  response: any;
}

export interface FantasySquadResponse {
  players: {
    goalkeepers: PlayerInfo[];
    defenders: PlayerInfo[];
    midfielders: PlayerInfo[];
    forwards: PlayerInfo[];
  },
  remainingBudget: number;
  fantasyTeamName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SquadService {

  private baseUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) { }

  getFantasySquad(): Observable<FantasySquadResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/user/squad`).pipe(
      map(resp => resp.response)
    );
  }

  updateFantasySqaud(players: PlayerInfo[]): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/user/squad`, players);
  }

  getPlayers(position: string): Observable<PlayerInfo[]> {
    const params = new HttpParams().append("position", position);
    return this.http.get<ApiResponse>(`${this.baseUrl}/players`, {
      params: params
    }).pipe(
      map(resp => resp.response)
    );
  }

  updateFantasyTeamName(name: string | null): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/user/squad/name`, {
      name: name
    });
  }
}
