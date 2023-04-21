import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { take } from 'rxjs';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private authService: AuthService, private dialog: MatDialog, private router: Router) {

  }

  abandonAccBtnHandler() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.accept.pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.authService.abandonAccount().pipe(
          take(1)
        ).subscribe({
          next: () => {
            const ref = this.dialog.open(MessageDialogComponent);
            ref.componentInstance.header = 'Success';
            ref.componentInstance.message = 'Account deleted permanently.';
            ref.afterClosed().pipe(take(1)).subscribe({
              next: () => this.router.navigate(['/'])
            });
          },
          error: (err) => {
            console.log(err);
          } 
        })
      }
    })
  }

  logout() {
    this.authService.logOut().pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => console.log(err)
    });
  }
}
