import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iOrder } from 'src/app/core/models/order.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent {

    orders: iOrder[] = [];
      
    constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router, private socketService: SocketService) {
      


    }
  
    ngOnInit(): void {
      
      this.api.get('/orders/').subscribe((response) => {
        console.log("response", response)
        this.orders = response.body.payload;
        console.log(this.orders);
      });
    }
}
