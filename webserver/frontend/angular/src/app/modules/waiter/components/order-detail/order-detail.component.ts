import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { iOrder } from 'src/app/core/models/order.model';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { eListenChannels } from 'src/app/core/models/channels.enum';
import { Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { iTempOrder } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  receivedData: iTempOrder | undefined;

  displayedOrder: iOrder | undefined;


  roomReference: iRoom[] = [];
  subscriptionRoom: Subscription | undefined;
  tableReference: iTable[] = [];
  subscriptionTable: Subscription | undefined;

  categoryReference: any;
  subscriptionCategory: Subscription | undefined;

  constructor(private router: Router, public pageData: PageDataService, public reference: DatabaseReferencesService, private io: SocketService, private pageInfo: PageInfoService) {
    Promise.resolve().then(() => this.pageInfo.pageMessage = "🍜Order Detail");
    this.subscriptionCategory = this.reference.categoriesReferenceObservable.subscribe((value) => {
      console.log("value", value);
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
  }



  ngOnInit(): void {
    if (this.pageData.data != undefined) {
      this.receivedData = this.pageData.data;
      this.displayedOrder = this.receivedData?.order!;

      const room = this.roomReference.find((room) => room._id === this.displayedOrder?.room);
      this.displayedOrder.room = room?.name!;

      for (let i = 0; i < this.displayedOrder.tables.length; i++) { //the let tables of array didnt work >:(
        const table = this.displayedOrder.tables[i];
        const tableReference = this.tableReference.find((tableReference) => tableReference._id === table);
        this.displayedOrder.tables[i] = tableReference?.name!;
      }
      console.log("displayed", this.displayedOrder);
    } else {
      this.router.navigate(['/core/waiter/orders']);
    }

  }



  ngOnDestroy(): void {
    this.subscriptionCategory?.unsubscribe();
    this.subscriptionRoom?.unsubscribe();
    this.subscriptionTable?.unsubscribe();
  }


}


