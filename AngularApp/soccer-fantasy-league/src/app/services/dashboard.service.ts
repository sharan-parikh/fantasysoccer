import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PlayerInfo {
  id: number;
  name: string;
  cost: number;
  totalPoints: number;
  position: string;
}

export interface FantasySquadResponse {
  goalKeepers: PlayerInfo[];
  defenders: PlayerInfo[];
  midfielders: PlayerInfo[];
  forwards: PlayerInfo[];
}

@Injectable({
  providedIn: 'root'
})
export class SqaudService {

  constructor() { }

  getFantasySquad(): Observable<FantasySquadResponse> {
    return new Observable((observer) => {
      observer.next({
        goalKeepers: [],
        defenders: [],
        midfielders: [],
        forwards: [
          {
            id: 1, name: "Lionel Messi", cost: 10, totalPoints: 40, position: 'Attacker'
          }
        ]
      });
    });
  }

  getPlayers(): Observable<PlayerInfo[]> {
    return new Observable((observer) => {
      observer.next([

      ]);
    })
  }
}
