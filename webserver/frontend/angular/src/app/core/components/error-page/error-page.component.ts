import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css'],
})

export class ErrorPageComponent implements OnInit{
  errorCode: number = 404;
  errorMessage: string = 'Page Not Found';
  image:string='404.jpg';

  constructor(private route: ActivatedRoute,protected pageInfo: PageInfoService) {
  }
    ngOnInit(): void {
      this.route.data.subscribe((data) => {
        Promise.resolve().then(() => this.pageInfo.pageMessage = "⚠️Error " +data['errorCode']+"⚠️");
        this.errorCode = data['errorCode'];
        this.errorMessage = data['errorMessage'];
        this.image=data['image'];
      });
    }

  
  

}
