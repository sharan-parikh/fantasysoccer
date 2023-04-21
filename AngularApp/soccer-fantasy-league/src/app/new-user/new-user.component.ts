import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { switchMap, take } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private dialog: MatDialog) {
  
  }

  signupForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    firstName: ['', Validators.required],
    lastName: [''],
    dob: [new Date(), Validators.required],
    fantasySquadName: ['', [Validators.required, Validators.minLength(4)]]
  });

  signUp() {
    this.authService.signUp({ ...this.signupForm.value, dob: (this.signupForm.controls.dob.value as Date).toISOString().split('T')[0]}).pipe(
      take(1)
    )
    .subscribe({
      next: (resp) => {
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = 'Success'; 
        dialogRef.componentInstance.message = 'User creation successfull';
        dialogRef.afterClosed().pipe(
          switchMap(() => this.authService.logIn(this.signupForm.controls.email.value, this.signupForm.controls.password.value))
        ).subscribe({
          next: () => {
            this.router.navigate(['/dashboard'])
          },
          error: (err) => console.log(err)
        });
      },
      error: (err) => {
        console.log(err);
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = "Error";
        if(err.status === 501) {
          dialogRef.componentInstance.message = "Fantasy name is supplied is already taken. Please select another name."
        } else {
          dialogRef.componentInstance.message = "An unexpected error occurred.";
        }
      }
    });
  }
}
