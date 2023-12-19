import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ArchiveComponent } from './components/archive/archive.component';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import { ChartComponent } from './components/chart/chart.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    StatisticsComponent,
    ArchiveComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,

    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    SharedModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    



  ]
})
export class AnalyticsModule { }
