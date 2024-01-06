import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iCategory } from 'src/app/core/models/category.model';
import { iIngredient } from 'src/app/core/models/ingredient.model';
import { iOrder } from 'src/app/core/models/order.model';
import { iRecipe } from 'src/app/core/models/recipe.model';
import { iRestaurantInformation } from 'src/app/core/models/restaurant_information.model';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-order.detail',
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.css']
})
export class OrderDetailComponent {
  receivedOrder: iOrder | undefined;

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

  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router, private socketService: SocketService,
    private references: DatabaseReferencesService, public pageData: PageDataService,
    private pageInfo: PageInfoService, private auth: AuthService) {
      
    Promise.resolve().then(() => this.pageInfo.pageMessage = "💰Cashout Detail Order");


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
    });


    this.receivedOrder = this.pageData.data;
    if(this.receivedOrder == undefined){
      this.router.navigate(['core/cashier/cashout']);
    }
  }

  ngOnInit(): void {
  }
  
  checkOrder() {
    /*
    const printWindow: Window | null = window.open('', '_blank');

    if (printWindow) {
        printWindow.document.write('<html><head><title>Check</title></head><body>');
        const printThisElement: HTMLElement | null = document.getElementById('print');

        if (printThisElement) {
            printWindow.document.write(printThisElement.innerHTML);
        }

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        this.router.navigate(['core/cashier/cashout']);
    }
    */
    this.api.post('/order_archives/'+ this.receivedOrder?._id,{}).subscribe((response) => {
      if(response.status == 200){
        //console.log("Order Archived", response);
        this.notifier.showSuccess(response.status, response.body.message);
        this.router.navigate(['core/cashier/cashout']);
      }
    }
    );
  }

}
