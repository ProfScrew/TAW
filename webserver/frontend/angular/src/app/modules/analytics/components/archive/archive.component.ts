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

import { DatePipe } from '@angular/common';
import { iRecipe } from 'src/app/core/models/recipe.model';
import { iIngredient } from 'src/app/core/models/ingredient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [DatePipe]
})
export class ArchiveComponent {
  //archives data
  displayElements: iOrderArchive[] | undefined;
  storedArchives : iOrderArchive[] | undefined;
  logs: boolean = false;

  //date range
  dateRange = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    //logs boolean checkbox
    logs: new FormControl()
  });




  recipeReference: iRecipe[] = [];
  ingredientReference: iIngredient[] = [];

  subscriptionRecipe: Subscription | undefined;
  subscriptionIngredient: Subscription | undefined;

  constructor(private api: ApiService, private notifier: NotifierComponent, private router: Router,
    private references: DatabaseReferencesService, public pageData: PageDataService,
    public pageInfo: PageInfoService, private auth: AuthService, public datePipe: DatePipe) {

    Promise.resolve().then(() => this.pageInfo.pageMessage = "📦Archive");

    this.subscriptionRecipe = this.references.recipesReferenceObservable.subscribe((value) => {
      this.recipeReference = value!;
    });
    this.subscriptionIngredient = this.references.ingredientsReferenceObservable.subscribe((value) => {
      this.ingredientReference = value!;
    });


    }

  ngOnInit(): void {
    this.setDefaultDates();

    this.getArchive();
  }

  ngAfterViewInit(): void {
    console.log(this.storedArchives)
  }

  getArchive(): void {
    this.api.get('/order_archives',undefined).subscribe((response) => {
      this.storedArchives = response.body.payload;
      for(let archive of this.storedArchives!){
        for(let course of archive.courses){
          for(let dish of course.dishes){
            dish.recipe_obj = this.recipeReference.find((recipe) => recipe._id == dish.recipe);
            if(dish.modifications?.length! > 0){
              for(let modification of dish.modifications!){
                modification.ingredient_obj = this.ingredientReference.find((ingredient) => ingredient._id == modification.ingredient);
              }
            }
          }
        }
      }
      
      console.log(this.storedArchives)
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
    this.logs = this.dateRange.value.logs;
  }
}
