import { Component } from '@angular/core';
import { PageInfoService } from '../../services/page-info.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent {

  constructor(private pageInfo: PageInfoService) { 
    Promise.resolve().then(() => pageInfo.setPageMessage("Welcome!"));
  }

}
