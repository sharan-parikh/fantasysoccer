import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {

  constructor(private fb: FormBuilder, private authService: AuthService) {
  
  }

  signupForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.minLength(8)],
    firstName: ['', Validators.required],
    lastName: [''],
    dob: ['', Validators.required]
  });

  signUp() {
    this.authService.signUp(this.signupForm.value);
  }
}
