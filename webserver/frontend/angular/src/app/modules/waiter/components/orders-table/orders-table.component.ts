import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { eListenChannels, eSocketRooms } from 'src/app/core/models/channels.enum';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { eOrderStatus, iOrder } from 'src/app/core/models/order.model';
import { ApiService } from 'src/app/core/services/api.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { Router } from '@angular/router';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { iOrderData, iOrderPlusReferences } from '../../models/order.model';
import { iRoom } from 'src/app/core/models/room.model';
import { iTable } from 'src/app/core/models/table.model';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';






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
  orders: iOrder[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private api: ApiService, private sockerService: SocketService,private pageInfo: PageInfoService, private pageData: PageDataService, private router: Router, public references: DatabaseReferencesService) {
    this.dataSource = new MatTableDataSource();
    this.getReferences();
    Promise.resolve().then(() => this.pageInfo.pageMessage = "🏃‍♀️Orders");
  }

  getReferences() {
    this.api.get('/rooms').subscribe((responce) => {
      this.roomReference = responce.body.payload;
    });
    this.api.get('/tables').subscribe((responce) => {
      this.tableReference = responce.body.payload;
    });
  }


  ngOnInit(): void {
    this.api.get(this.route).subscribe((responce) => {
      this.orders = responce.body.payload;
      let ordersData: iOrderData[] = [];
      this.orders.forEach((order) => {
        let orderData: iOrderData = {
          room: this.roomReference.find((room) => room._id === order.room)?.name!,
          tables: this.tableReference.find((table) => table._id === order.tables[0])?.name!,
          guests: order.guests.toString(),
          status: order.status!,
        };
        ordersData.push(orderData);
      });

      this.dataSource = new MatTableDataSource<iOrderData>(ordersData);
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    this.sockerService.joinRoom(eSocketRooms.waiter);
    this.sockerService.listen(eListenChannels.tables).subscribe((responce) => {
      console.log(responce);
      this.api.get('/tables').subscribe((responce) => {
        this.tableReference = responce.body.payload;
      });
    });
    
    this.sockerService.listen(eListenChannels.orders).subscribe((responce) => {
      console.log(responce);
      this.ngOnInit();
    });

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendData(data: any) {

    const table = this.tableReference.find((reference) => reference.name == data.tables[0]);
    if (table) {
    this.orders.forEach((order) => {
        order.tables.forEach((tableId) => {
          if (tableId == table._id) {
            console.log("Order Found",order);
            const orderPlusReferences = {
              order: order,
              roomReference: this.roomReference,
              tableReference: this.tableReference,
            } as iOrderPlusReferences;
            this.pageData.data = orderPlusReferences;
            this.router.navigate(['/core/waiter/orders/detail']);
          }
        });
      });
    }
  }
}


