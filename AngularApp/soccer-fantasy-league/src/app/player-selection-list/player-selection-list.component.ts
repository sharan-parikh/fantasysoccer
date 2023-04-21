import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayerInfo } from '../services/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-player-selection-list',
  templateUrl: './player-selection-list.component.html',
  styleUrls: ['./player-selection-list.component.scss']
})
export class PlayerSelectionListComponent implements OnInit {

  @Input() players: PlayerInfo[] = [];
  @Output() playerSelected = new EventEmitter<PlayerInfo>();
  dataSource = new MatTableDataSource<PlayerInfo>();
  
  displayedColumns = ['player', 'cost', 'totalPoints'];

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.players);   
  }
}
