
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide=true;
  username: string = '';
  password: string = '';
  rememberMe: boolean = true;

  constructor(private router: Router, private auth: AuthService,private notifier: NotifierComponent) { }

  ngOnInit(): void {
    this.autoLogin();
  }

  autoLogin() {
    if (this.auth.isLogged()) {
      this.router.navigate(['/core/logo']);
    }
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.notifier.showError(404,"Error: Please fill out all fields");
    } else {
      this.auth.login(this.username, this.password, this.rememberMe).subscribe({
        next: (response:any) => {
          this.router.navigate(['/core']);
          //console.log(response);
          this.notifier.showSuccess(response.status, response.body.message);
        },
        error: (err:any) => {
          //console.log(err);
          if(err!=undefined && err.status!=undefined && err.error!=undefined && err.error.message!=undefined){
            this.notifier.showError(err.status, err.error.message);
          }else{
            this.notifier.showError(404,"Error: Server is down");
          }  
        }
      });
    }
  }
}
