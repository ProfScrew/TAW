import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { MessageAlertComponent } from './components/message.alert/message.alert.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    MessageAlertComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  providers: [
    AuthService,
    HttpService
  ]
})
export class CoreModule { }
