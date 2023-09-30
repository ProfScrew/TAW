import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HTTPErrorComponent } from './pages/httperror/httperror.component';
import { WaiterTablesComponent } from './pages/waiter/tables/tables.component';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { WaiterMenuComponent } from './pages/waiter/menu/menu.component';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { MenuItemComponent } from './pages/waiter/menu/menu.item.component';
import { OrderComponent } from './pages/order/order.component';
import { CourseComponent } from './components/order/course/course.component';
import { DishComponent } from './components/order/dish/dish.component';
import { ListComponent } from './components/order/list/list.component';
import { InputComponent } from './components/input/input.component';
import { UserInteractionComponent } from './components/interaction/interaction.component';
import { MenuViewComponent } from './components/menu/view/view.component';
import { SelectComponent } from './components/select/select.component';
import { ProdComponent } from './pages/prod/prod.component';
import { CardComponent } from './components/card/card.component';
import { TableService } from './services/table.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HTTPErrorComponent,
    WaiterTablesComponent,
    WaiterMenuComponent,
    OrderComponent,
    ListComponent,
    ProdComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableComponent,
    ModalComponent,
    NavigationComponent,
    ButtonComponent,
    CheckboxComponent,
    MenuItemComponent,
    CourseComponent,
    DishComponent,
    InputComponent,
    UserInteractionComponent,
    MenuItemComponent,
    MenuViewComponent,
    SelectComponent,
    CardComponent,
    HttpClientModule
  ],
  providers: [
    {provide: AuthService,  useClass: AuthService},
    {provide: TableService, useClass: TableService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
