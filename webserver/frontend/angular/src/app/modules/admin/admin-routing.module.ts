import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { authGuard } from 'src/app/core/guards/auth.guard';// import the AuthGuard class

const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard], // use the AuthGuard class
  },
  {
    path: '', 
    redirectTo: 'users',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
