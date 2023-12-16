import { Component } from '@angular/core';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/core/services/socket.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router, private socketService: SocketService, 
    private pageInfo: PageInfoService, private auth: AuthService) {
      
    Promise.resolve().then(() => this.pageInfo.pageMessage = "📊Statistics");

  }
}
