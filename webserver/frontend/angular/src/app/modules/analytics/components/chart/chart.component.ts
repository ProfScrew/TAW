
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
  @Input() config: ChartConfiguration | undefined;
  chart: Chart | undefined;

  private updateSubscription: Subscription | undefined;

  constructor(private el: ElementRef, private updateService: UpdateService) {
    this.updateSubscription = this.updateService.booleanValue$.subscribe((value:any) => {
      console.log(value)
      this.update();
    });
  }

  ngOnInit() {
    const ctx = (this.el.nativeElement as HTMLElement).querySelector('canvas') as HTMLCanvasElement;
    this.chart=new Chart(ctx, this.config!);
    

  }

  update(){
    this.chart!.update();
  }


}