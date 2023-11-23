import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';

import { AuthService } from './services/auth.service';

import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NgIf} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatBadgeModule} from '@angular/material/badge';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion'; 




import { MasterContainerComponent } from './components/master-container/master-container.component';
import { NotifierComponent } from './components/notifier/notifier.component';
import { ApiService } from './services/api.service';
import { LogoComponent } from './components/logo/logo.component';


@NgModule({
  declarations: [
    MasterContainerComponent,
    NotifierComponent,
    LogoComponent,
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
    MatBadgeModule,
    FormsModule,
    MatExpansionModule,

    // Toastr
    ToastrModule.forRoot(
      { 
        timeOut: 5000,
        progressBar: true,
      }
    ),


    

  ],
  providers: [
    AuthService,
    ApiService,
    
    NotifierComponent,

  ]
})
export class CoreModule { }
