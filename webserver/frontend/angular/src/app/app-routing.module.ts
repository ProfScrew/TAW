import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './core/components/error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),

  },
  {
    path: '',
    loadChildren:() =>
      import('./core/core.module').then((m) => m.CoreModule),
  },
  { 
    path: '**',
    pathMatch: 'full',  
    component: ErrorPageComponent,
    data: { errorCode: 404, errorMessage: 'Page Not Found',image: '404.jpg'}
  }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
