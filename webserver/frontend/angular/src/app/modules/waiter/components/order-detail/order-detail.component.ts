import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iOrder } from 'src/app/core/models/order.model';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { iOrderPlusReferences } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  receivedData: iOrderPlusReferences | undefined;

  displayedOrder: iOrder | undefined;

  constructor(public pageData: PageDataService) { }

  ngOnInit(): void {
    this.receivedData = this.pageData.data;
    this.displayedOrder = this.receivedData?.order;

    if (this.displayedOrder) {
      const room = this.receivedData?.roomReference.find((room) => room._id === this.displayedOrder?.room);
      this.displayedOrder.room = room?.name!;

      for (let i = 0; i < this.displayedOrder.tables.length; i++) { //the let tables of array didnt work >:(
        const table = this.displayedOrder.tables[i];
        const tableReference = this.receivedData?.tableReference.find((tableReference) => tableReference._id === table);
        this.displayedOrder.tables[i] = tableReference?.name!;
      }
      console.log("displayed",this.displayedOrder);
    }

  }


}


