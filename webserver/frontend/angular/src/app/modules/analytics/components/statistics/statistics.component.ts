import { Component, ViewChild } from '@angular/core';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { COLORS, CHART_COLORS, transparentize, labels } from '../../models/utils.model';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  dataForStatistics: iOrderArchive[] | undefined;
  storedArchives: iOrderArchive[] | undefined;

  @ViewChild('earningsChart') private earningChart: ChartComponent | undefined;
  @ViewChild('waiterServingChart') private waiterChart: ChartComponent | undefined;
  @ViewChild('productionChart') private productionChart: ChartComponent | undefined;
  @ViewChild('customersChart') private customersChart: ChartComponent | undefined;

  //raw data
  waiter: any | undefined;
  production: any | undefined;
  earnings: any | undefined;
  //data for charts
  productionCooking: any = undefined;
  earningsData: any = undefined;
  customersData: any = undefined;
  waiterServing: any = undefined;
  waiterData: any | undefined;

  dateRange = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl()
  });


  //data for statistics
  numberDays: number = 0;


  constructor(private api: ApiService,
    public pageData: PageDataService,
    public pageInfo: PageInfoService, private breakpointObserver: BreakpointObserver) {

    Promise.resolve().then(() => this.pageInfo.pageMessage = "📊Statistics");

  }

  ngOnInit(): void {
    this.setDefaultDates();

    this.getArchive();

    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe(result => {
      if (result.matches) {
        this.earningChart?.resize();
        this.waiterChart?.resize();
        this.productionChart?.resize();
        this.customersChart?.resize();
      }
    });
  }

  getArchive(): void {
    this.api.get('/order_archives', '').subscribe((response) => {
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
    this.numberDays = this.dateRange.value.dateTo.getTime() - this.dateRange.value.dateFrom.getTime();
    this.numberDays = this.numberDays / (1000 * 3600 * 24) + 1;
    console.log(this.numberDays);
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

    this.numberDays = this.dateRange.value.dateTo.getTime() - this.dateRange.value.dateFrom.getTime();
    this.numberDays = this.numberDays / (1000 * 3600 * 24);

  }

  changeDate(): void {
    this.sortByDate();
    this.calculateStatistics();
  }
  calculateStatistics(): void {
    console.log("Calculating statistics");

    //Calculate average earning per day
    this.calculateArgEarningPerDay();
    this.calculateWaiterEfficiency();
    this.calculateProductionEfficiency();

    this.initGraphs();
  }

  calculateWaiterEfficiency(): void {
    console.log("Calculating waiter efficiency");
    let labels: string[] = [];
    let servings: number[] = [];
    let orders: number[] = [];
    let total = 0;

    if (this.dataForStatistics) {
      this.dataForStatistics.forEach((archive) => {
        archive.courses.forEach((course) => {
          if (!labels.includes(course.logs_course.created_course.actor.username)) {
            labels.push(course.logs_course.created_course.actor.username);
            servings.push(0);
            orders.push(1);
          } else {
            let index = labels.indexOf(course.logs_course.created_course.actor.username);
            orders[index]++;

          }
          if (!labels.includes(course.logs_course.served_course?.actor.username!)) {
            labels.push(course.logs_course.served_course?.actor.username!);
            servings.push(1);
            orders.push(0);
          } else {
            let index = labels.indexOf(course.logs_course.served_course?.actor.username!);
            servings[index]++;


          }
          total++;
        });
      });
      this.waiter = {
        labels: labels,
        servings: servings,
        orders: orders,
        total: total
      };
      console.log(labels);
      console.log(servings);
      console.log(orders);

    }

  }
  calculateProductionEfficiency(): void {
    console.log("Calculating production efficiency");
    let labels: string[] = [];
    let cookings: number[] = [];

    if (this.dataForStatistics) {
      this.dataForStatistics.forEach((archive) => {
        archive.courses.forEach((course) => {
          course.dishes.forEach((dish) => {
            if (!labels.includes(dish.logs_status?.finish_cooking.actor.username!)) {
              labels.push(dish.logs_status?.finish_cooking.actor.username!);
              cookings.push(1);
            } else {
              let index = labels.indexOf(dish.logs_status?.finish_cooking.actor.username!);
              cookings[index]++;
            }
          });
        });
      });
      this.production = {
        labels: labels,
        cookings: cookings
      };
      console.log("production", this.production);
    }
  }
  calculateArgEarningPerDay(): void {
    console.log("Calculating average earning per day");
    let labels: string[] = [];
    let earningsPerDay: number[] = [];
    let earningsPerPerson: number[] = [];
    let earningsPerDish: number[] = [];
    let earningsPerCourse: number[] = [];
    let customers: number[] = [];

    if (this.dataForStatistics) {

      let temporaryDay = new Date(this.dateRange.value.dateFrom);
      for (let i = 0; i < this.numberDays; i++) {



        let dayArchive: iOrderArchive[] = [];
        this.dataForStatistics.forEach((archive) => {

          if (new Date(archive.logs_order.created_order.timestamp).getFullYear() === temporaryDay.getFullYear() &&
            new Date(archive.logs_order.created_order.timestamp).getMonth() === temporaryDay.getMonth() &&
            new Date(archive.logs_order.created_order.timestamp).getDate() == temporaryDay.getDate()) {
            dayArchive.push(archive);
          }
        });
        if (dayArchive.length > 0) {
          let totalEarningPerDay = 0;
          let totalEarningPerPerson = 0;
          let totalEarningPerDish = 0;

          let customersPerDay = 0;

          let numberOfDishes = 0;
          let numberOfCourses = 0;


          dayArchive.forEach((archive) => {
            totalEarningPerDay += archive.final_price;
            totalEarningPerPerson += archive.charges_persons;
            customersPerDay += archive.guests;
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
          customers.push(customersPerDay);
        }
        else {
          labels.push(temporaryDay.getDate().toString());
          earningsPerDay.push(0);
          earningsPerPerson.push(0);
          earningsPerDish.push(0);
          earningsPerCourse.push(0);
          customers.push(0);

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
      customers: customers
    }

    console.log(this.earnings);


  }

  formatDayAndMonth(date : Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  }

  initGraphs(): void {

    this.waiterData = {
      labels: this.waiter.labels,
      datasets: [{
        label: 'Servings',
        data: this.waiter.servings,
        backgroundColor: Object.values(CHART_COLORS),
      },
      {
        label: 'Orders',
        data: this.waiter.orders,
        backgroundColor: Object.values(CHART_COLORS),
      }
      ]
    }
    this.waiterChart!.update(this.waiterData);

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

    this.earningChart!.update(this.earningsData);


    this.productionCooking = {
      labels: this.production.labels,
      datasets: [{
        label: 'Cookings dishes per person',
        data: this.production.cookings,
        backgroundColor: Object.values(CHART_COLORS),
      }
      ]
    }
    this.productionChart!.update(this.productionCooking);

    this.customersData = {
      labels: this.earnings?.label!,
      datasets: [
        {
          label: 'Customers per day',
          data: this.earnings?.customers!,
          borderColor: CHART_COLORS.red,
          backgroundColor: transparentize(CHART_COLORS.red, 0.5),
        }
      ]
    };
    this.customersChart!.update(this.customersData);
  }

  //chart configs---------------------------------------------
  //line chart
  earningsConfig: ChartConfiguration = {
    type: 'line',
    data: this.earningsData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Earnings Chart',
          color: 'red'
        }
      }
    },
  };
  customersConfig: ChartConfiguration = {
    type: 'line',
    data: this.customersData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Customers per day Chart',
          color: 'red'
        }
      }
    },
  };
  //pie chart
  waiterConfig: ChartConfiguration = {
    type: 'pie',
    data: this.waiterServing,
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Waiters Working Chart',
          color: 'red'
        }
      }
    },
  };
  productionConfig: ChartConfiguration = {
    type: 'pie',
    data: this.productionCooking,
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Cooking Chart',
          color: 'red'
        }
      }
    },
  };


}
