import { Component, OnInit } from '@angular/core';
import { SqaudService, PlayerInfo } from '../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { RemovePlayerDialogComponent } from '../remove-player-dialog/remove-player-dialog.component';
import { take } from 'rxjs';
import { PlayerSelectionListComponent } from '../player-selection-list/player-selection-list.component';

@Component({
  selector: 'app-squad-selection',
  templateUrl: './squad-selection.component.html',
  styleUrls: ['./squad-selection.component.scss']
})
export class SquadSelectionComponent implements OnInit {
  playersSelected = 0;
  moneyRemaining = 100;

  dataSource: any;
  goalKeepersDataSource: PlayerInfo[] = [];
  defendersDataSource: PlayerInfo[] = [];
  midfieldersDataSource: PlayerInfo[] = [];
  forwardsDataSource: PlayerInfo[] = [];

  displayedColumns: string[] = ['player', 'cost', 'totalPoints'];

  constructor(private squadService: SqaudService, public dialog: MatDialog) {
    
  }


  private getPlaceHolder(): PlayerInfo {
    return {
      id: 0, name: "Select Player", cost: 0, totalPoints: 0, position: ""
    }
  }

  ngOnInit(): void {
    this.initDataSources();
  }

  initDataSources() {
    this.dataSource = this.squadService.getFantasySquad().subscribe(players => {
      this.goalKeepersDataSource = players.goalKeepers
      while(this.goalKeepersDataSource.length < 2) {
        this.goalKeepersDataSource.push(this.getPlaceHolder());
      }

      this.defendersDataSource = players.defenders;
      while(this.defendersDataSource.length < 5) {
        this.defendersDataSource.push(this.getPlaceHolder());
      }

      this.midfieldersDataSource = players.midfielders;
      while(this.midfieldersDataSource.length < 5) {
        this.midfieldersDataSource.push(this.getPlaceHolder());
      }

      this.forwardsDataSource = players.forwards;
      while(this.forwardsDataSource.length < 3) {
        this.forwardsDataSource.push(this.getPlaceHolder());
      }
    });
  }

  playerSelected(playerInfo: PlayerInfo) {
    if(playerInfo.id === 0) {
      this.squadService.getPlayers().pipe(
        take(1)
      ).subscribe({
        next: (players) => {
          const dialogRef = this.dialog.open(PlayerSelectionListComponent);
          dialogRef.componentInstance.players = players.filter(player => {
            // filter and show players which are not selected.
          });
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      const dialogRef = this.dialog.open(RemovePlayerDialogComponent);
      dialogRef.componentInstance.header = playerInfo.name;
      dialogRef.componentInstance.removePlayer.pipe(
        take(1)
      ).subscribe({
        next: () => {
          this.goalKeepersDataSource = this.goalKeepersDataSource.filter(player => player.id != playerInfo.id);
          this.defendersDataSource = this.defendersDataSource.filter(player => player.id != playerInfo.id);
          this.midfieldersDataSource = this.midfieldersDataSource.filter(player => player.id != playerInfo.id);
          this.forwardsDataSource = this.forwardsDataSource.filter(player => player.id != playerInfo.id);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
  
}
