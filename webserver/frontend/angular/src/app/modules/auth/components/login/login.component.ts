
import { Component, ViewChild, ViewChildren, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide=true;
  username: string = '';
  password: string = '';
  rememberMe: boolean = true;

  constructor(private router: Router, private errorMessage: MatSnackBar, private auth: AuthService,private notifier: NotifierComponent) { }

  onSubmit() {
    // Add your login logic here (e.g., send a request to the server).
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);
    if (!this.username || !this.password) {
      //use notifier component
      this.notifier.showError("Error: Please fill out all fields");
      // this.errorMessage.openFromComponent(MessageAlertComponent, {
      //   data: { message: "Error: Please fill out all fields" },
      //   duration: 10000, // Adjust the duration as needed
      // });
      return;
    } else {
      this.auth.login(this.username, this.password, this.rememberMe).subscribe({
        next: (d) => {
          this.router.navigate(['/core']);
          //use notifier component
          this.notifier.showSuccess("Login Successful");
          // this.errorMessage.openFromComponent(MessageAlertComponent, {
          //   data: { message: "Login Successful" },
          //   duration: 10000, // Adjust the duration as needed
          // });
        },
        error: (err) => {
          console.log(err);
          //use notifier component
          this.notifier.showError("Error: Login Failed");
          // this.errorMessage.openFromComponent(MessageAlertComponent, {
          //   data: { message: "Error: Login Failed" },
          //   duration: 10000, // Adjust the duration as needed
          // });
        }
      });
    }



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