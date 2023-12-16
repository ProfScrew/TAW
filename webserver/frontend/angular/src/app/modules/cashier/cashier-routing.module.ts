import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashoutComponent } from './components/cashout/cashout.component';
import { authGuard, eRole } from 'src/app/core/guards/auth.guard';
import { OrderDetailComponent } from './components/order.detail/order.detail.component';

const routes: Routes = [
  {
    path: 'cashout',
    component: CashoutComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Cashier }
  },
  {
    path: 'cashout/detail',
    component: OrderDetailComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Cashier }
  },
  {
    path: '', 
    redirectTo: 'cashout',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashierRoutingModule { }
