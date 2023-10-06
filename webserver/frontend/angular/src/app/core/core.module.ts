import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';

import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';

import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { ToastrModule } from 'ngx-toastr';




import { MasterContainerComponent } from './components/master-container/master-container.component';
import { MessageAlertComponent } from './components/message.alert/message.alert.component';
import { NotifierComponent } from './components/notifier/notifier.component';


@NgModule({
  declarations: [
    MasterContainerComponent,
    MessageAlertComponent,
    NotifierComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    HttpClientModule,

    // Angular Material
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    NgIf,

    // Toastr
    ToastrModule.forRoot(),


    

  ],
  providers: [
    AuthService,
    HttpService,
    
    NotifierComponent,

  ]
})
export class CoreModule { }
