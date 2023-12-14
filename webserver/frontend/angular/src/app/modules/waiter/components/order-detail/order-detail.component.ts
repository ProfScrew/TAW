import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { eOrderStatus, iOrder } from 'src/app/core/models/order.model';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { eListenChannels } from 'src/app/core/models/channels.enum';
import { Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { iCourseToDisplay, iOrderToDisplay, iTempOrder } from '../../models/order.model';
import { eDishStatus, iDish, iDishModification } from 'src/app/core/models/dish.model';
import { ApiService } from 'src/app/core/services/api.service';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iIngredient } from 'src/app/core/models/ingredient.model';
import { iRecipe } from 'src/app/core/models/recipe.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  menuSelector: boolean = false;

  receivedData: iTempOrder | undefined;
  displayedOrder: iOrderToDisplay | undefined;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.ngOnDestroy();
  }

  roomReference: iRoom[] = [];
  subscriptionRoom: Subscription | undefined;
  tableReference: iTable[] = [];
  subscriptionTable: Subscription | undefined;
  ingredientReference: iIngredient[] | undefined;
  subscriptionIngredient: Subscription | undefined;
  recipeReference: iRecipe[] | undefined;
  subscriptionRecipe: Subscription | undefined;
  categoryReference: any;
  subscriptionCategory: Subscription | undefined;

  constructor(private router: Router, public pageData: PageDataService, public reference: DatabaseReferencesService,
    private io: SocketService, private pageInfo: PageInfoService, private api: ApiService,
    private notifier: NotifierComponent) {
    this.receivedData = { ... this.pageData.data };
    if (Object.keys(this.receivedData as Object).length === 0) {
      this.router.navigate(['/core/waiter/orders']);
    }

    Promise.resolve().then(() => this.pageInfo.pageMessage = "🍜Order Detail");
    this.subscriptionCategory = this.reference.categoriesReferenceObservable.subscribe((value) => {
      //console.log("value", value);
      this.categoryReference = value;
    });
    this.subscriptionRoom = this.reference.roomsReferenceObservable.subscribe((value) => {
      this.roomReference = value as iRoom[];
      if (this.displayedOrder) {
        const room = this.roomReference.find((room) => room._id === this.displayedOrder?.room);
        this.displayedOrder.room = room?.name!;
      }
    });
    this.subscriptionTable = this.reference.tablesReferenceObservable.subscribe((value) => {
      this.tableReference = value as iTable[];
      if (this.displayedOrder) {
        for (let i = 0; i < this.displayedOrder.tables.length; i++) { //the let tables of array didnt work >:(
          const table = this.displayedOrder.tables[i];
          const tableReference = this.tableReference.find((tableReference) => tableReference._id === table);
          this.displayedOrder.tables[i] = tableReference?.name!;
        }
      }
    });

    this.subscriptionIngredient = this.reference.ingredientsReferenceObservable.subscribe((value) => {
      this.ingredientReference = value;

    });
    this.subscriptionRecipe = this.reference.recipesReferenceObservable.subscribe((value) => {
      this.recipeReference = value;
    });

  }

  substituteDish(): void {
    if (this.displayedOrder) {

      let arrayOfDishes: string[] = [];
      this.receivedData?.order?.courses?.forEach((course) => {
        course.dishes?.forEach((dish) => {
          arrayOfDishes.push(dish!);
        });
      });
      if (arrayOfDishes.length !== 0) {
        //not param but query
        let stringOfArrayToSent = "id=" + JSON.stringify(arrayOfDishes);
        this.api.get("/dishes", stringOfArrayToSent).subscribe({
          next: (response) => {
            //substitute
            this.receivedData?.order?.courses?.forEach((course) => {
              let tempDishes: iDish[] = [];
              course.dishes?.forEach((dish, index) => {
                let dishToSubstitute = response.body.payload.find((dishToSubstitute: { _id: string | undefined; }) => dishToSubstitute._id === dish);
                tempDishes.push(dishToSubstitute!);
              });

              this.displayedOrder?.courses?.push({
                _id: course._id,
                dishes: tempDishes,
                logs_course: course.logs_course,
              });
            });
            this.displayedOrder?.courses?.forEach((course) => {
              course.dishes?.forEach((dish) => {
                dish.name = this.recipeReference?.find((recipe) => recipe._id === dish.recipe)?.name!;
                dish.modifications?.forEach((modification) => {
                  modification.name = this.ingredientReference?.find((ingredient) => ingredient._id === modification.ingredient)?.name!;
                });
              });
            });



            //remember to remove this notifier
            //this.notifier.showSuccess(response.status, "Got Dishes");
          },
          error: (err) => {
            //console.log(err);
            this.notifier.showError(err.status, err.error.message);
            return;
          }
        });
      }
    }
  }

  ngOnInit(): void {
    this.receivedData = { ... this.pageData.data };
    if (Object.keys(this.receivedData as Object).length !== 0) {

      this.api.put("/orders/" + this.pageData.data.order._id + "/action/" + eOrderStatus.ordering, []).subscribe({
        next: (response) => {
          this.notifier.showSuccess(response.status, response.body.message);
        },
        error: (err) => {
          //console.log(err);
          this.notifier.showError(err.status, err.error.message);
          this.router.navigate(['/core/waiter/orders']);
        }
      });

      let tempOrder = {
        _id: this.receivedData?.order?._id,
        guests: this.receivedData?.order?.guests,
        status: this.receivedData?.order?.status,
        room: this.receivedData?.order?.room,
        tables: this.receivedData?.order?.tables,
        capacity: this.receivedData?.order?.capacity,

        courses: [] as iCourseToDisplay[],
      } as iOrderToDisplay;
      this.displayedOrder = tempOrder;
      this.displayedOrder.tables = [...this.receivedData?.order?.tables!];
      this.substituteDish()
      const room = this.roomReference.find((room) => room._id === this.displayedOrder?.room);
      this.displayedOrder.room = room?.name!;
      for (let i = 0; i < this.displayedOrder.tables.length; i++) { //the let tables of array didnt work >:(
        const table = this.displayedOrder.tables[i];
        const tableReference = this.tableReference.find((tableReference) => tableReference._id === table);
        this.displayedOrder.tables[i] = tableReference?.name!;
      }
      //console.log("displayed", this.displayedOrder);
    } else {
      this.router.navigate(['/core/waiter/orders']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptionCategory?.unsubscribe();
    this.subscriptionRoom?.unsubscribe();
    this.subscriptionTable?.unsubscribe();
    if (Object.keys(this.receivedData as Object).length !== 0) {
      if (this.menuSelector === false) {
        if (this.receivedData?.order.courses.length === 0) {
          this.api.put("/orders/" + this.pageData.data.order._id + "/action/" + eOrderStatus.waiting, {}).subscribe({
            next: (response) => {
              //this.notifier.showSuccess(response.status, response.message);
            },
            error: (err) => {
              //console.log(err);
              this.notifier.showError(err.status, err.error.message);
              this.router.navigate(['/core/waiter/orders']);
            }
          });

        }
        else {
          this.api.put("/orders/" + this.pageData.data.order._id + "/action/" + eOrderStatus.serving, {}).subscribe({
            next: (response) => {
              //this.notifier.showSuccess(response.status, response.message);
            },
            error: (err) => {
              //console.log(err);
              this.notifier.showError(err.status, err.error.message);
              this.router.navigate(['/core/waiter/orders']);
            }
          });
        }
      }
    }
  }

  addCourse() {
    this.pageData.data = { ... this.receivedData };
    this.menuSelector = true;
    this.router.navigate(['/core/waiter/orders/detail/menu']);
  }

  deleteCourse(index: number) {
    this.receivedData?.courses?.splice(index, 1);
    this.pageData.data = { ...this.receivedData };
  }

  submitOrder() {
    let orderToSent: iOrder = { ...this.receivedData?.order! };
    let dishestoSent: iDish[] = [];
    let arrayEachCourseLength: number[] = [];
    let offsetExistingCourse = 0;

    if (orderToSent.courses.length > 0) {
      offsetExistingCourse = orderToSent.courses.length;
    }

    for (let course of this.receivedData?.courses!) {//prepare the dishes to be sent and take note of the length of each course
      orderToSent.courses.push({
        dishes: [],
      });
      let counter = 0;
      for (let dish of course.dishes) {
        counter++;
        let modifications: iDishModification[] = [];
        for (let modification of dish.modifications!) {
          modifications.push({
            ingredient: modification.ingredient,
            type: modification.type,
          });
        }
        //push dishes in idish array and post it to database
        dishestoSent.push({
          recipe: dish.recipe,
          actual_price: dish.actual_price,
          notes: dish.notes,
          status: eDishStatus.waiting,
          modifications: modifications,
        });
      }
      arrayEachCourseLength.push(counter);
    }

    this.api.post("/dishes", dishestoSent).subscribe({ //post the dishes and receive the ids
      next: (response) => {
        let arrayTacker = 0;
        let counterInsideArray = 0
        for (let currentDish of response.body.payload) { //sort and push the dishes in the orderToSent
          if (counterInsideArray < arrayEachCourseLength[arrayTacker]) {
            orderToSent.courses[arrayTacker + offsetExistingCourse].dishes?.push(currentDish);
            counterInsideArray++;
          } else {
            counterInsideArray = 0;
            arrayTacker++;
            orderToSent.courses[arrayTacker + offsetExistingCourse].dishes?.push(currentDish);
            counterInsideArray++;
          }
        }
        this.api.put("/orders/" + orderToSent._id + "/action/" + eOrderStatus.serving, orderToSent).subscribe({ //push the order in the database
          next: (response) => {
            this.notifier.showSuccess(response.status, response.body.message);
            this.router.navigate(['/core/waiter/orders']);
          },
          error: (err) => {
            //console.log(err);
            this.notifier.showError(err.status, err.error.message);
            return;
          }
        });
      },
      error: (err) => {
        //console.log(err);
        this.notifier.showError(err.status, err.error.message);
        return;
      }
    });


    //receive from post the ids of the dishes and push them in the orderToSent


    //push ordertosent in the database

  }
}


