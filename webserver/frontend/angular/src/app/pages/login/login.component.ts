import { Component, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxComponent } from 'src/app/components/checkbox/checkbox.component';
import { InputComponent } from 'src/app/components/input/input.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  providers: [CheckboxComponent]
})
export class LoginComponent {
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
}
