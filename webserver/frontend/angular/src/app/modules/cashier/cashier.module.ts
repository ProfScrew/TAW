import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashierRoutingModule } from './cashier-routing.module';
import { CashoutComponent } from './components/cashout/cashout.component';
import { OrderDetailComponent } from './components/order.detail/order.detail.component';
import { TablesComponent } from './components/tables/tables.component';



import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    CashoutComponent,
    OrderDetailComponent,
    TablesComponent
  ],
  imports: [
    CommonModule,
    CashierRoutingModule,

    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,

  ]
})
export class CashierModule { }
