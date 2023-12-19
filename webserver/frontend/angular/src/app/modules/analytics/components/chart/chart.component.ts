
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
  @Input() config: ChartConfiguration | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const ctx = (this.el.nativeElement as HTMLElement).querySelector('canvas') as HTMLCanvasElement;
    new Chart(ctx, this.config!);
  }
}