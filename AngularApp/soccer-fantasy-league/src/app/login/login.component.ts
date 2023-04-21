import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  pswFormControl = new FormControl('', [Validators.required]);

  constructor(private loginService: AuthService, private router: Router, private dialog: MatDialog) {

  }

  tryLogin() {
    this.loginService.logIn(this.emailFormControl.value, this.pswFormControl.value).pipe(
      take(1)
    ).subscribe({
      next: (_) => this.router.navigate(['/dashboard']),
      error: () => {
        const dialogRef = this.dialog.open(MessageDialogComponent);
        dialogRef.componentInstance.header = "Error";
        dialogRef.componentInstance.message = "Please enter the correct credentials.";
      }
    });
  }

  routeToSignUpScreen() {
    this.router.navigate(['/signup']);
  }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}