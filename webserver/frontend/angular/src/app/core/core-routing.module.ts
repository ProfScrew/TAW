import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterContainerComponent } from './components/master-container/master-container.component';

const routes: Routes = [

  {
    path: 'dashboard',
    component: MasterContainerComponent,
    //canActivate: [AuthGuard],
    //children: [
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
