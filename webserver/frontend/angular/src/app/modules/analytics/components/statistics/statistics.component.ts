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
import { ChartConfiguration, ChartData } from 'chart.js/auto';
import { iEarnings } from '../../models/statistics.model';

import { COLORS, CHART_COLORS, transparentize } from '../../models/utils.model';
import { UpdateService } from '../../services/update.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  dataForStatistics: iOrderArchive[] | undefined;
  storedArchives: iOrderArchive[] | undefined;


  dateRange = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl()
  });


  //data for statistics
  numberDays: number = 0;


  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router,
    private references: DatabaseReferencesService, public pageData: PageDataService,
    public pageInfo: PageInfoService, private auth: AuthService,
    public updateService: UpdateService) {

    Promise.resolve().then(() => this.pageInfo.pageMessage = "📊Statistics");

  }

  ngOnInit(): void {
    this.setDefaultDates();

    this.getArchive();
  }

  getArchive(): void {
    this.api.get('/order_archives', undefined).subscribe((response) => {
      this.storedArchives = response.body.payload;

      this.sortByDate();
    });
  }
  sortByDate(): void {
    const dateFrom = this.dateRange.value.dateFrom;
    const dateTo = this.dateRange.value.dateTo;

    if (dateFrom && dateTo) {
      this.dataForStatistics = this.storedArchives?.filter((archive) => {
        const date = new Date(archive.logs_order.created_order.timestamp);
        return date >= dateFrom && date <= dateTo;
      });
    }
    this.numberDays = this.dateRange.value.dateTo.getDate() - this.dateRange.value.dateFrom.getDate();
    this.calculateStatistics();
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

    this.numberDays = this.dateRange.value.dateTo.getDate() - this.dateRange.value.dateFrom.getDate();

  }

  changeDate(): void {
    console.log(this.dateRange.value);
    this.sortByDate();
    this.calculateArgEarningPerDay();
  }


  calculateStatistics(): void {
    console.log("Calculating statistics");
    
    //Calculate average earning per day
    this.calculateArgEarningPerDay();
    //array of days


  }


  earnings: iEarnings | undefined;

  calculateArgEarningPerDay(): void {
    console.log("Calculating average earning per day");
    let labels: string[] = [];
    let earningsPerDay: number[] = [];
    let earningsPerPerson: number[] = [];
    let earningsPerDish: number[] = [];
    let earningsPerCourse: number[] = [];

    if (this.dataForStatistics) {

      let temporaryDay = new Date(this.dateRange.value.dateFrom);
      for (let i = 0; i < this.numberDays; i++) {



        let dayArchive: iOrderArchive[] = [];
        this.dataForStatistics.forEach((archive) => {

          if (new Date(archive.logs_order.created_order.timestamp).getDate() == temporaryDay.getDate()) {
            dayArchive.push(archive);
          }
        });
        if (dayArchive.length > 0) {
          let totalEarningPerDay = 0;
          let totalEarningPerPerson = 0;
          let totalEarningPerDish = 0;

          let numberOfDishes = 0;
          let numberOfCourses = 0;


          dayArchive.forEach((archive) => {
            totalEarningPerDay += archive.final_price;
            totalEarningPerPerson += archive.charges_persons;
            archive.courses.forEach((course) => {
              course.dishes.forEach((dish) => {
                totalEarningPerDish += dish.actual_price;
                numberOfDishes++;
              });
              numberOfCourses++;
            });
          });
          labels.push(temporaryDay.getDate().toString());
          earningsPerDay.push(parseFloat((totalEarningPerDay / dayArchive.length).toFixed(2)));
          earningsPerPerson.push(parseFloat((totalEarningPerPerson / dayArchive.length).toFixed(2)));
          earningsPerDish.push(parseFloat((totalEarningPerDish / numberOfDishes).toFixed(2)));
          earningsPerCourse.push(parseFloat((totalEarningPerDish / numberOfCourses).toFixed(2)));
        }
        else {
          labels.push(temporaryDay.getDate().toString());
          earningsPerDay.push(0);
          earningsPerPerson.push(0);
          earningsPerDish.push(0);
          earningsPerCourse.push(0);
          
        }


        temporaryDay.setDate(temporaryDay.getDate() + 1);
      }
    }

    this.earnings = {
      label: labels,
      chargesPerOrder: earningsPerDay,
      chargesPerPerson: earningsPerPerson,
      chargesPerDish: earningsPerDish,
      chargesPerCourse: earningsPerCourse,
    }

    console.log(this.earnings);

    this.earningsData = {
      labels: this.earnings?.label!,
      datasets: [
        {
          label: 'Earnings per day',
          data: this.earnings?.chargesPerOrder!,
          borderColor: CHART_COLORS.red,
          backgroundColor: transparentize(CHART_COLORS.red, 0.5),
        },
        {
          label: 'Earnings per person',
          data: this.earnings?.chargesPerPerson!,
          borderColor: CHART_COLORS.blue,
          backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
        },
        {
          label: 'Earnings per dish',
          data: this.earnings?.chargesPerDish!,
          borderColor: CHART_COLORS.green,
          backgroundColor: transparentize(CHART_COLORS.green, 0.5),
        },
        {
          label: 'Earnings per course',
          data: this.earnings?.chargesPerCourse!,
          borderColor: CHART_COLORS.yellow,
          backgroundColor: transparentize(CHART_COLORS.yellow, 0.5),
        }
      ]
    };

    this.earningsConfig.data = this.earningsData;

    this.updateService.updateBooleanValue(true);
    
  }
  

  earningsData :any = undefined;


  earningsConfig: ChartConfiguration= {
    type: 'line',
    data: this.earningsData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      }
    },
  };





















  // Doughnut
  data_doughnut = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)'
        ]
      }
    ]
  };

  doughnutChartConfig: ChartConfiguration = {
    type: 'doughnut',
    data: this.data_doughnut,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Doughnut Chart'
        }
      }
    },
  };


}
