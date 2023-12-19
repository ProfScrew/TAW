import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iOrderArchive } from 'src/app/core/models/order_archive.model';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseReferencesService } from 'src/app/core/services/database-references.service';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { ChartComponent } from '../chart/chart.component';
import {ChartConfiguration} from 'chart.js/auto';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  
  displayElements: iOrderArchive[] | undefined;
  storedArchives : iOrderArchive[] | undefined;


  dateRange = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl()
  });

  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router,
    private references: DatabaseReferencesService, public pageData: PageDataService,
    public pageInfo: PageInfoService, private auth: AuthService) {

    Promise.resolve().then(() => this.pageInfo.pageMessage = "📊Statistics");

    }

  ngOnInit(): void {
    this.setDefaultDates();

    this.getArchive();
  }

  getArchive(): void {
    this.api.get('/order_archives',undefined).subscribe((response) => {
      this.storedArchives = response.body.payload;

      this.sortByDate();
    });
  }
  sortByDate(): void {
    const dateFrom = this.dateRange.value.dateFrom;
    const dateTo = this.dateRange.value.dateTo;

    if (dateFrom && dateTo) {
      this.displayElements = this.storedArchives?.filter((archive) => {
        const date = new Date(archive.logs_order.created_order.timestamp);
        return date >= dateFrom && date <= dateTo;
      });
    }
  }

  setDefaultDates(): void {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Set default dates to the current month's range
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    this.dateRange.patchValue({
      dateFrom: startDate,
      dateTo: endDate
    });
  }

  changeDate(): void {
    console.log(this.dateRange.value);
    this.sortByDate()
  }

  data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };
  
  barChartConfig: ChartConfiguration = {
    type: 'doughnut',
    data: this.data,
    options: {
      responsive: true,
      maintainAspectRatio: false, // Set this to false to allow the chart to be responsive
    }
  };

 

}
