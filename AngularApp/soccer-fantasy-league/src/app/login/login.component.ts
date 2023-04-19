import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  pswFormControl = new FormControl('', [Validators.required]);

  constructor(private loginService: AuthService, private router: Router) {

  }

  tryLogin() {
    const isSuccess = this.loginService.logIn(this.emailFormControl.value, this.pswFormControl.value);
    if(isSuccess) {
      this.router.navigate(['/dashboard']);
    }
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