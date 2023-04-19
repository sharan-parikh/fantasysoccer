import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerInfo } from '../services/dashboard.service';

@Component({
  selector: 'app-player-selection-list',
  templateUrl: './player-selection-list.component.html',
  styleUrls: ['./player-selection-list.component.scss']
})
export class PlayerSelectionListComponent {

  @Input() players: PlayerInfo[] = [];
  @Output() playerSelected = new EventEmitter<PlayerInfo>();
  
  displayedColumns = ['player', 'cost', 'totalPoints'];
}
