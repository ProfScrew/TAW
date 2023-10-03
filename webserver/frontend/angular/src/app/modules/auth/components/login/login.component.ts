
import { Component, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { MessageAlertComponent } from 'src/app/core/components/message.alert/message.alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  username: string = '';
  password: string = '';
  rememberMe: boolean = true;
  durationInSeconds: number = 5;
  constructor(private errorMessage: MatSnackBar) {}

    onSubmit() {
      // Add your login logic here (e.g., send a request to the server).
      console.log('Username:', this.username);
      console.log('Password:', this.password);
      this.errorMessage.openFromComponent(MessageAlertComponent, {
        data: { message: "Error AAAAAAAAAAAAA" },
        duration: 10000, // Adjust the duration as needed
      });
  }
}

/*
errorMessage: string = '';

  @ViewChild(CheckboxComponent) remember!: CheckboxComponent;

  username:    string = '';
  password: string = '';

  constructor(private router: Router, private access: AuthService) { }

  updateUsername(username: string) {
    console.log(username);
    
    this.username = username;
  }

  updatePassword(password: string) {
    console.log(password);
    
    this.password = password;
  }

  login() {
    const remember = this.remember.checked;
    console.log(this.username, this.password, remember);
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Please fill out all fields';
      return;
    }

    this.access.login(this.username, this.password, remember).subscribe({
      next: (d) => {
        this.errorMessage = '';
        this.router.navigate(['/waiter/tables']);
      },

      error: (err) => {
        this.errorMessage = err.message;
        console.log(err);        
      }
    });
  }


*/