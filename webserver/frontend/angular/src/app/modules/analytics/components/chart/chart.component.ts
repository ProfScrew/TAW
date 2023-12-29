import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
  @Input() config: ChartConfiguration | undefined;
  private chart: Chart | undefined;
  Breakpoints=Breakpoints;


  constructor(private el: ElementRef,public pageInfo: PageInfoService) {}

  ngOnInit() {
    const ctx = (this.el.nativeElement as HTMLElement).querySelector('canvas') as HTMLCanvasElement;
    this.chart=new Chart(ctx, this.config!);
    

  }

  update(data: any){
    this.chart!.data=data;
    this.chart!.update();
  }

  resize(){
    this.chart?.resize();
  }


}