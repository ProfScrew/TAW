import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//angualr material

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { DynamicTableFormComponent } from './components/dynamic-table-form/dynamic-table-form.component';

import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicTableComponent,
    DynamicTableFormComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  exports: [
    DynamicFormComponent,
    DynamicTableComponent,
    DynamicTableFormComponent,
  ]
})
export class SharedModule { }
