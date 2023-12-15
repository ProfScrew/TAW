import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaiterRoutingModule } from './waiter-routing.module';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { MenuSelectorComponent } from './components/menu-selector/menu-selector.component';
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
import { OrderFormComponent } from './components/order-form/order-form.component';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReadyComponent } from './components/ready/ready.component';





@NgModule({
  declarations: [
    OrdersTableComponent,
    OrderDetailComponent,
    MenuSelectorComponent,
    OrderFormComponent,
    ReadyComponent,
  ],
  imports: [
    CommonModule,
    WaiterRoutingModule,

    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    SharedModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDividerModule,
    MatTabsModule,
    MatExpansionModule,
  
    



  ]
})
export class WaiterModule { }
