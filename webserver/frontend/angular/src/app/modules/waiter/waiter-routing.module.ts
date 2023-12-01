import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, eRole } from 'src/app/core/guards/auth.guard';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { MenuSelectorComponent } from './components/menu-selector/menu-selector.component';

const routes: Routes = [
  {
    path: 'orders',
    component: OrdersTableComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Waiter }
  },
  {
    path: 'orders/detail',
    component: OrderDetailComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Waiter }
  },
  {
    path: 'orders/detail/menu',
    component: MenuSelectorComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Waiter }
  },
  {
    path: '', 
    redirectTo: 'orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaiterRoutingModule {}
