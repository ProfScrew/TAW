import { Component } from '@angular/core';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/core/services/socket.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/core/services/api.service';
import { iCourse, iOrder } from 'src/app/core/models/order.model';
import { iUser } from 'src/app/core/models/user.model';
import { iCategory } from 'src/app/core/models/category.model';
import { iTable } from 'src/app/core/models/table.model';
import { iRoom } from 'src/app/core/models/room.model';
import { iRecipe } from 'src/app/core/models/recipe.model';
import { iIngredient } from 'src/app/core/models/ingredient.model';
import { Subscription } from 'rxjs';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { eDishModificationType, iDish } from 'src/app/core/models/dish.model';
import { iRestaurantInformation } from 'src/app/core/models/restaurant_information.model';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-cashout',
  templateUrl: './cashout.component.html',
  styleUrls: ['./cashout.component.css']
})
export class CashoutComponent {

  orders: iOrder[] = [];
  ordersToDisplay: iOrder[] = [];
  myUser: iUser | undefined;
  myCategories: iCategory[] = [];

  restaurantInformations: iRestaurantInformation | undefined;

  tableReference: iTable[] = [];
  roomReference: iRoom[] = [];
  recipeReference: iRecipe[] = [];
  ingredientReference: iIngredient[] = [];
  categoriesReference: iCategory[] = [];

  subscriptionTable: Subscription | undefined;
  subscriptionRoom: Subscription | undefined;
  subscriptionRecipe: Subscription | undefined;
  subscriptionIngredient: Subscription | undefined;
  subscriptionCategory: Subscription | undefined;
  Breakpoints=Breakpoints;


  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router, private socketService: SocketService,
    private references: DatabaseReferencesService, public pageData: PageDataService,
    public pageInfo: PageInfoService, private auth: AuthService) {

    Promise.resolve().then(() => this.pageInfo.pageMessage = "💰Cashout");


    this.subscriptionTable = this.references.tablesReferenceObservable.subscribe((value) => {
      this.tableReference = value!;
    });
    this.subscriptionRoom = this.references.roomsReferenceObservable.subscribe((value) => {
      this.roomReference = value!;
    });
    this.subscriptionRecipe = this.references.recipesReferenceObservable.subscribe((value) => {
      this.recipeReference = value!;
    });
    this.subscriptionIngredient = this.references.ingredientsReferenceObservable.subscribe((value) => {
      this.ingredientReference = value!;
    });
    this.subscriptionCategory = this.references.categoriesReferenceObservable.subscribe((value) => {
      this.categoriesReference = value!;
    });

    this.api.get('/restaurant_informations/').subscribe((response) => {
      this.restaurantInformations = response.body.payload[0];
      console.log("RESTAURANT INFORMATIONS", this.restaurantInformations);
    });

  }

  ngOnInit(): void {

    this.api.get('/orders/').subscribe((response) => {
      this.orders = response.body.payload;
      this.getDishes();
    });
  }


  getDishes() {
    this.api.get('/dishes/').subscribe((response) => {
      let tempDishes = response.body.payload as iDish[];

      tempDishes.forEach((dish: iDish) => {
        let tempRecipe = this.recipeReference.find((recipe) => recipe._id === dish.recipe);
        dish.name = tempRecipe?.name;
        dish.category = tempRecipe?.category;
      });
      this.orders.forEach((order) => {
        order.tablesNames = '';
        order.tables.forEach((table) => {
          order.tablesNames += this.tableReference.find((tempTable) => tempTable._id === table)?.name + ', ';
        });
        order.roomName = this.roomReference.find((tempRoom) => tempRoom._id === order.room)?.name;

        order.courses.forEach((course) => {
          course.tablesNames = '';
          course.orderId = order._id;
          course.dishes_obj = [];
          course.dishes!.forEach((dish) => {
            course.dishes_obj?.push(tempDishes.find((tempDish: iDish) => tempDish._id === dish) || {} as iDish);

            course.dishes_obj?.forEach((dish) => {
              //elaborate ingredients name in case of modification
              dish.modifications?.forEach((mod) => {
                let tempIngredient = this.ingredientReference.find((ingredient) => ingredient._id === mod.ingredient);
                mod.name = tempIngredient?.name;
                let tempPrice
                switch (mod.type) {
                  case eDishModificationType.add:
                    tempPrice = tempIngredient?.modification_price;
                    break;
                  case eDishModificationType.remove:
                    tempPrice = -tempIngredient?.modification_price!;
                    break;
                  case eDishModificationType.less:
                    tempPrice = -((tempIngredient?.modification_percentage! * tempIngredient?.modification_price!) / 100);
                    break;
                  case eDishModificationType.more:
                    tempPrice = ((tempIngredient?.modification_percentage! * tempIngredient?.modification_price!) / 100);
                    break;
                  default:
                    tempPrice = 0;
                    break;
                }
                mod.price = tempPrice;
              });
            });
          });
        });
      });
      this.extractReadyOrders();
    });
  }

  extractReadyOrders() {
    this.orders.forEach((order) => {
      let checkOrder = true;
      let final_price = 0;

      order.courses.forEach((course) => {
        if (course.logs_course?.served_course == undefined) {
          checkOrder = false;
          
        }else{
          course.dishes_obj?.forEach((dish) => {
            final_price += dish.actual_price!;
          });
        }
      });

      if (checkOrder) {
        final_price = final_price + (this.restaurantInformations?.charge_per_person! * order.guests);
        order.serviceCharge = (this.restaurantInformations?.charge_per_person! * order.guests)
        order.final_price = final_price;
        this.ordersToDisplay.push(order);
      }
    });
    console.log("ORDERS TO DISPLAY",this.ordersToDisplay);
  }

  cashoutOrder(orderId: string) {
      this.pageData.data = this.ordersToDisplay.find((order) => order._id === orderId);
      this.router.navigate(['core/cashier/cashout/detail']);
  }
    

}
