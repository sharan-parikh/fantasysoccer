import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerInfo } from '../services/dashboard.service';

@Component({
  selector: 'app-remove-player-dialog',
  templateUrl: './remove-player-dialog.component.html',
  styleUrls: ['./remove-player-dialog.component.scss']
})
export class RemovePlayerDialogComponent {

  @Input() header: string = "";
  @Output() removePlayer = new EventEmitter();

}
