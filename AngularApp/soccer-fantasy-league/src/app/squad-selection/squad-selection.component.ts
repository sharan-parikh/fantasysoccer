import { Component, OnInit } from '@angular/core';
import { SquadService, PlayerInfo } from '../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { RemovePlayerDialogComponent } from '../remove-player-dialog/remove-player-dialog.component';
import { take } from 'rxjs';
import { PlayerSelectionListComponent } from '../player-selection-list/player-selection-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-squad-selection',
  templateUrl: './squad-selection.component.html',
  styleUrls: ['./squad-selection.component.scss']
})
export class SquadSelectionComponent implements OnInit {
  playersSelected = 0;
  moneyRemaining = "0";
  allPlayersSelected = false;
  fantasyTeamName = "";

  private goalkeepers: PlayerInfo[] = [];
  private defenders: PlayerInfo[] = [];
  private midfielders: PlayerInfo[] = [];
  private forwards: PlayerInfo[] = [];


  goalKeepersDataSource: MatTableDataSource<PlayerInfo> = new MatTableDataSource();
  defendersDataSource: MatTableDataSource<PlayerInfo> = new MatTableDataSource();
  midfieldersDataSource: MatTableDataSource<PlayerInfo> = new MatTableDataSource();
  forwardsDataSource: MatTableDataSource<PlayerInfo> = new MatTableDataSource();

  displayedColumns: string[] = ['player', 'cost', 'totalPoints'];

  constructor(private squadService: SquadService, public dialog: MatDialog) {
    
  }


  private getPlaceHolder(position: string): PlayerInfo {
    return {
      id: 0, name: "Select Player", cost: 0, totalPoints: 0, position: position, realteamName: ""
    }
  }

  ngOnInit(): void {
    this.initDataSources();
  }

  initDataSources() {
    this.squadService.getFantasySquad().pipe(
      take(1)
    ).subscribe(squadDetails => {
      this.fantasyTeamName = squadDetails.fantasyTeamName;
      this.moneyRemaining = squadDetails.remainingBudget.toFixed(2);
      this.goalkeepers = [...squadDetails.players.goalkeepers];
      while(this.goalkeepers.length < 2) {
        this.goalkeepers.push(this.getPlaceHolder('Goalkeeper'));
      }
      this.goalKeepersDataSource = new MatTableDataSource(this.goalkeepers);

      this.defenders = [...squadDetails.players.defenders];
      while(this.defenders.length < 5) {
        this.defenders.push(this.getPlaceHolder('Defender'));
      }
      this.defendersDataSource = new MatTableDataSource(this.defenders);

      this.midfielders = [...squadDetails.players.midfielders];
      while(this.midfielders.length < 5) {
        this.midfielders.push(this.getPlaceHolder('Midfielder'));
      }
      this.midfieldersDataSource = new MatTableDataSource(this.midfielders);

      this.forwards = [...squadDetails.players.forwards];
      while(this.forwards.length < 3) {
        this.forwards.push(this.getPlaceHolder('Attacker'));
      }
      this.forwardsDataSource = new MatTableDataSource(this.forwards);
      this.playersSelected = this.getAllSelectedPlayers().length;
    });
  }

  playerSelected(playerInfo: PlayerInfo, index: number) {
    if(playerInfo.id === 0) {
      this.squadService.getPlayers(playerInfo.position).pipe(
        take(1)
      ).subscribe({
        next: (players) => {
          const dialogRef = this.dialog.open(PlayerSelectionListComponent);
          let dataSourceToFilter: PlayerInfo[] = [];
          dataSourceToFilter = this.getDataSource(playerInfo.position);
          dialogRef.componentInstance.players = players.filter(player => {
            return dataSourceToFilter.findIndex(p => p.id === player.id) === -1 && player.cost <= parseFloat(this.moneyRemaining)
          });
          dialogRef.componentInstance.playerSelected.pipe(
            take(1)
          ).subscribe(playerSelected => {
            dataSourceToFilter[index] = playerSelected;
            this.setTableData(playerInfo.position, dataSourceToFilter);
            this.dialog.closeAll();
            this.updatePlayerCount();
            this.updateRemainingBudget(-playerSelected.cost);
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
          this.goalKeepersDataSource = new MatTableDataSource(this.goalKeepersDataSource.data.map(player => this.removePlayerHandler(player, playerInfo)));
          this.defendersDataSource = new MatTableDataSource(this.defendersDataSource.data.map(player => this.removePlayerHandler(player, playerInfo)));
          this.midfieldersDataSource = new MatTableDataSource(this.midfieldersDataSource.data.map(player => this.removePlayerHandler(player, playerInfo)));
          this.forwardsDataSource = new MatTableDataSource(this.forwardsDataSource.data.map(player => this.removePlayerHandler(player, playerInfo)));
          this.dialog.closeAll();
          this.updatePlayerCount();
          this.updateRemainingBudget(playerInfo.cost);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  private updatePlayerCount() {
    this.playersSelected = this.getAllSelectedPlayers().filter(player => player.id !== 0).length;
    this.allPlayersSelected = this.playersSelected === 15;
  }

  private getAllSelectedPlayers() {
    return [...this.defendersDataSource.data, ...this.goalKeepersDataSource.data, ...this.midfieldersDataSource.data,
      ...this.forwardsDataSource.data];
  }

  private removePlayerHandler(player: PlayerInfo, playerToRemove: PlayerInfo) {
    if(player.id === playerToRemove.id) {
      return this.getPlaceHolder(playerToRemove.position);
    } else {
      return player;
    }
  }

  private updateRemainingBudget(amount: number) {
    this.moneyRemaining = (parseFloat(this.moneyRemaining) + amount).toFixed(2);
  }

  getDataSource(position: string): PlayerInfo[] {
    switch(position) {
      case 'Goalkeeper': return this.goalKeepersDataSource.data;
      case 'Defender': return this.defendersDataSource.data;
      case 'Midfielder': return this.midfieldersDataSource.data;
      case 'Attacker': return this.forwardsDataSource.data; 
      default: return [];
    }
  }

  setTableData(position: string, players: PlayerInfo[]): void{
    switch(position) {
      case 'Goalkeeper': this.goalKeepersDataSource = new MatTableDataSource(players); break;
      case 'Defender': this.defendersDataSource = new MatTableDataSource(players); break;
      case 'Midfielder': this.midfieldersDataSource = new MatTableDataSource(players); break;
      case 'Attacker': this.forwardsDataSource = new MatTableDataSource(players); break;
    }
  }

  updateFantasySqaud() {
    this.squadService.updateFantasySqaud(this.getAllSelectedPlayers()).pipe(
      take(1)
    ).subscribe({
      next: (_) => {
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = "Success";
        dialogRef.componentInstance.message = "Fantasy squad updated successfully.";
        this.allPlayersSelected = false;
      },
      error: (err) => {
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = "Error";
        dialogRef.componentInstance.message = "An unexpected error occurred while updating your fantasy squad.";
      }
    })
  }
}
