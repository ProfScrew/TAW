import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, eRole } from 'src/app/core/guards/auth.guard';
import { QueueComponent } from './components/queue/queue.component';

const routes: Routes = [

  {
    path: 'queue',
    component: QueueComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Production }
  },
  {
    path: '', 
    redirectTo: 'queue',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule {
}
