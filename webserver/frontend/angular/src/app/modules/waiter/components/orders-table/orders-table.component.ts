import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { eListenChannels } from 'src/app/core/models/channels.enum';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { eOrderStatus, iOrder } from 'src/app/core/models/order.model';
import { ApiService } from 'src/app/core/services/api.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { Router } from '@angular/router';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { iOrderData, iTempOrder } from '../../models/order.model';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { Subscription } from 'rxjs';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';




@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css']
})
export class OrdersTableComponent implements AfterViewInit {


  route = '/orders';

  displayedColumns: string[] = ['room', 'tables', 'guests', 'status'];
  dataSource: MatTableDataSource<iOrderData>;

  roomReference: iRoom[] = [];
  tableReference: iTable[] = [];
  subscriptionRoom: Subscription | undefined;
  subscriptionTable: Subscription | undefined;
  orders: iOrder[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private api: ApiService, private sockerService: SocketService, private pageInfo: PageInfoService, private pageData: PageDataService,
     private router: Router, public references: DatabaseReferencesService, public notifier: NotifierComponent) {
    this.dataSource = new MatTableDataSource();

    Promise.resolve().then(() => this.pageInfo.pageMessage = "🏃‍♀️Orders");

  }

  ngOnDestroy(): void {
    this.subscriptionRoom?.unsubscribe();
    this.subscriptionTable?.unsubscribe();
  }


  ngOnInit(): void {
    this.subscriptionRoom = this.references.roomsReferenceObservable.subscribe((value) => {
      this.roomReference = value!;
      this.pushdataToSource();
    });
    this.subscriptionTable = this.references.tablesReferenceObservable.subscribe((value) => {
      this.tableReference = value!;
      this.pushdataToSource();
    });
    this.api.get(this.route).subscribe((responce) => {
      this.orders = responce.body.payload;
      this.pushdataToSource();

    });
  }
  pushdataToSource() {
    let ordersData: iOrderData[] = [];
    this.orders.forEach((order) => {
      let tables = '';
      order.tables.forEach((table) => {
        tables += this.tableReference.find((tableReference) => tableReference._id === table)?.name + ', ';
      });
      tables = tables.slice(0, -2);
      let orderData: iOrderData = {
        room: this.roomReference.find((room) => room._id === order.room)?.name!,
        tables: tables,
        guests: order.guests.toString(),
        status: order.status!,
      };
      ordersData.push(orderData);
    });

    this.dataSource = new MatTableDataSource<iOrderData>(ordersData);
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort!;
  }


  ngAfterViewInit() {
    this.sockerService.listen(eListenChannels.orders).subscribe((responce) => {
      this.updateOrders();
    });
  }
  updateOrders() {
    this.api.get(this.route).subscribe((responce) => {
      this.orders = responce.body.payload;
      this.pushdataToSource();
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;

      console.log("!", this.orders);
    });
  }

  ngOndestroy() {
    this.subscriptionRoom?.unsubscribe();
    this.subscriptionTable?.unsubscribe();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendData(data: any) {
    //find order by table id and send it to the order detail page
    let tempTable = data.tables.split(", ") as string[]; //note the tables is a string not array
    const table = this.tableReference.find((reference) => reference.name == tempTable[0]);
    if (table) {
      this.orders.forEach((order) => {
        order.tables.forEach((tableId) => {
          if (tableId == table._id) {
            if(order.status == eOrderStatus.ordering){
              this.notifier.showError(400,"Order is taken by another waiter");
            }else{
              const tempOrder = {
                order: order,
                courses: [],
              } as iTempOrder;
              this.pageData.data = tempOrder;
              this.router.navigate(['/core/waiter/orders/detail']);
            }
          }
        });
      });
    }
  }
}


