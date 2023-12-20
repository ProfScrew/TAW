import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iCategory } from 'src/app/core/models/category.model';
import { eListenChannels } from 'src/app/core/models/channels.enum';
import { iDish } from 'src/app/core/models/dish.model';
import { iIngredient } from 'src/app/core/models/ingredient.model';
import { iCourse, iOrder } from 'src/app/core/models/order.model';
import { iRecipe } from 'src/app/core/models/recipe.model';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { iUser } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.component.html',
  styleUrls: ['./ready.component.css']
})
export class ReadyComponent {

  
  orders: iOrder[] = [];
  courses: iCourse[] = [];
  myUser: iUser | undefined;
  myCategories: iCategory[] = [];

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


  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router, private socketService: SocketService, private references: DatabaseReferencesService,
    public pageInfo: PageInfoService, private auth: AuthService) {
      
    Promise.resolve().then(() => this.pageInfo.pageMessage = "🏃‍♀️💨Ready");

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

    }

  ngOnInit(): void {
    this.api.get('/orders/').subscribe((response) => {
      this.orders = response.body.payload;
      this.getDishes();
    });

  }

  ngAfterViewInit(): void {
    this.socketService.listen(eListenChannels.orders).subscribe((data) => {
      this.ngOnInit();
    });
    this.socketService.listen(eListenChannels.dishes).subscribe((data) => {
      this.ngOnInit();
    });
  }
  
  ngOnDestroy(): void {
    this.subscriptionTable?.unsubscribe();
    this.subscriptionRoom?.unsubscribe();
    this.subscriptionRecipe?.unsubscribe();
    this.subscriptionIngredient?.unsubscribe();
  }

  getDishes() {
    this.api.get('/dishes/').subscribe((response) => {
      let tempDishes = response.body.payload as iDish[];

      tempDishes.forEach((dish: iDish) => {
        let tempRecipe =  this.recipeReference.find((recipe) => recipe._id === dish.recipe);
        dish.name = tempRecipe?.name;
        dish.category = tempRecipe?.category;
      });
      this.orders.forEach((order) => {
        order.courses.forEach((course) => {
          course.tablesNames = '';
          course.orderId = order._id;
          course.confirmeButton = true;
          order.tables.forEach((table, index) => {
            const tempTable = this.tableReference.find((tempTable) => tempTable._id === table);
          
            if (tempTable) {
              course.tablesNames += tempTable.name;
              if (index < order.tables.length - 1) {
                course.tablesNames += ', ';
              }
            }
          });
          course.dishes_obj = [];
          course.dishes!.forEach((dish) => {
            course.dishes_obj?.push(tempDishes.find((tempDish: iDish) => tempDish._id === dish) || {} as iDish);

            course.dishes_obj?.forEach((dish) => {

              if (dish.logs_status?.finish_cooking == undefined) {
                course.confirmeButton = false;
              }
            });
          });
        });
      });
      this.extractReadyCourses();
    });
  }


  extractReadyCourses() {
    this.courses = [];
    this.orders.forEach((order) => {
      order.courses.forEach((course) => {
        if(course.logs_course?.ready_course != undefined && course.logs_course.served_course == undefined){
          this.courses.push(course);
        }
      });
    });
  }

  serveCourse(orderId: string,courseId: string) {
    //order server
    let tempOrder = this.orders.find((order) => order._id === orderId);
    this.api.put('/orders/' + orderId + '/action/' + courseId, tempOrder).subscribe((response) => {
      if (response.status === 200) {
        this.notifier.showSuccess(200, 'Course served successfully');
      } else {
        this.notifier.showError(400, 'Course served failed');
      }
    });

  }


}
