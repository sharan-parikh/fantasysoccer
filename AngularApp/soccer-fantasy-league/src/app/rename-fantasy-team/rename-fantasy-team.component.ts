import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SquadService } from '../services/dashboard.service';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-rename-fantasy-team',
  templateUrl: './rename-fantasy-team.component.html',
  styleUrls: ['./rename-fantasy-team.component.scss']
})
export class RenameFantasyTeamComponent {

  teamNameControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  constructor(private squadService: SquadService, private dialog: MatDialog) {

  }

  rename() {
    this.squadService.updateFantasyTeamName(this.teamNameControl.value).pipe(
      take(1)
    ).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = 'Success';
        dialogRef.componentInstance.message = 'Fantasy team name changed successfully';
      },
      error: (err) => {
        console.log(err);
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = 'Error';
        dialogRef.componentInstance.message = err.message || 'Fantasy team name rename unsuccessfull';
      }
    });
  }
}
