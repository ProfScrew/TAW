import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { authGuard, eRole } from 'src/app/core/guards/auth.guard';
import { ArchiveComponent } from './components/archive/archive.component';

const routes: Routes = [
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [authGuard], 
    data : { type: eRole.Analytics }
  },
  {
    path: 'archive',
    component: ArchiveComponent,
    canActivate: [authGuard],
    data : { type: eRole.Analytics }
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
export class AnalyticsRoutingModule { }
