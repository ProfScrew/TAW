import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})

export class ErrorPageComponent implements OnInit{
  errorCode: number = 404;
  errorMessage: string = 'Page not found';
  image:string='cat.jpg';

  constructor(private route: ActivatedRoute) {
  }
    ngOnInit(): void {
      this.route.data.subscribe((data) => {
        this.errorCode = data['errorCode'];
        this.errorMessage = data['errorMessage'];
        this.image=data['image'];
      });
    }

  
  

}
