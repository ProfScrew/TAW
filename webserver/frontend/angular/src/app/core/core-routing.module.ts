import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterContainerComponent } from './components/master-container/master-container.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: 'dashboard',
    component: MasterContainerComponent,
    canActivate: [authGuard],
    data: { type: '' },
    //children: [
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
