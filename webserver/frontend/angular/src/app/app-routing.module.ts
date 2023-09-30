import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component'
import { HTTPErrorComponent } from './pages/httperror/httperror.component';
import { WaiterTablesComponent } from './pages/waiter/tables/tables.component';
import { WaiterMenuComponent } from './pages/waiter/menu/menu.component';
import { canAccessGUI } from './guards/role-guard.guard';
import { OrderComponent } from './pages/order/order.component';
import { ProdComponent } from './pages/prod/prod.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'waiter/tables', component: WaiterTablesComponent, canActivate: [canAccessGUI], data: {role: 'waiter'}},
  { path: 'waiter/orders/:orderid', component: OrderComponent, canActivate: [canAccessGUI], data: {role: 'waiter'}},
  { path: 'waiter/orders/:orderid/menu', component: WaiterMenuComponent, canActivate: [canAccessGUI], data: {role: 'waiter'}},

  { path: 'prod/:id', component: ProdComponent, canActivate: [canAccessGUI], data: {role: 'production'}},
  
  { path: '', redirectTo: 'login', pathMatch: 'full'},  
  { path: '**', component: HTTPErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
