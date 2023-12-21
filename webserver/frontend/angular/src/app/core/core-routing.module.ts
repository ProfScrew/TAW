import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterContainerComponent } from './components/master-container/master-container.component';
import { authGuard } from './guards/auth.guard';
import { LogoComponent } from './components/logo/logo.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

const routes: Routes = [

  {
    path: 'core',
    component: MasterContainerComponent,
    canActivate: [authGuard],
    data: { type: '' },
    children: [
      {
        path: 'logo',
        component: LogoComponent,
        canActivate: [authGuard],
        data : { type: '' }
      },
      {
        path: 'admin',
        loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),
        canActivate: [authGuard],
        data: { type: 'admin' }
      },
      {
        path: 'waiter',
        loadChildren: () => import('../modules/waiter/waiter.module').then(m => m.WaiterModule),
        data: { type: 'waiter' }
      },
      {
        path: 'production',
        loadChildren: () => import('../modules/production/production.module').then(m => m.ProductionModule),
        data: { type: 'production' }
      },
      {
        path: 'cashier',
        loadChildren: () => import('../modules/cashier/cashier.module').then(m => m.CashierModule),
        data: { type: 'cashier' }
      },
      {
        path: 'analytics',
        loadChildren: () => import('../modules/analytics/analytics.module').then(m => m.AnalyticsModule),
        data: { type: 'analytics' }
      },
      {
        path: 'forbidden',
        component: ErrorPageComponent,
        data: { errorCode: 403 , errorMessage: 'Forbidden!',image: '403.jpg'}
      },
      {
        path: '',
        redirectTo: 'logo',
        pathMatch: 'full'
      },
      { 
        path: '**',
        pathMatch: 'full',  
        component: ErrorPageComponent,
        data: { errorCode: 404, errorMessage: 'Page Not Found!',image: '404.jpg'}
      }, 

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
