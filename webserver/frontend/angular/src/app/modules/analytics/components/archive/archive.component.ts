import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/core/services/api.service';
import { PageDataService } from 'src/app/core/services/page-data.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { DatabaseReferencesService, eArchivedStatus } from 'src/app/core/services/database-references.service';
import { DatePipe } from '@angular/common';
import { Breakpoints } from '@angular/cdk/layout';
import { iOrderArchive } from 'src/app/core/models/order_archive.model';
import { Subscription } from 'rxjs';
import { iRecipe } from 'src/app/core/models/recipe.model';
import { iIngredient } from 'src/app/core/models/ingredient.model';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [DatePipe],
})
export class ArchiveComponent {
  storedArchives: iOrderArchive[] | undefined;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize: number = 10;
  page: number = 1;
  logs: boolean = false;
  recipeReference: iRecipe[] = [];
  ingredientReference: iIngredient[] = [];

  subscriptionRecipe: Subscription | undefined;
  subscriptionIngredient: Subscription | undefined;
  Breakpoints = Breakpoints;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dateRange = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl(),
    logs: new FormControl(),
  });

  constructor(
    private api: ApiService,
    public pageData: PageDataService,
    public pageInfo: PageInfoService,
    public datePipe: DatePipe,
    private references: DatabaseReferencesService
  ) {
    references.changeArchivedStatus(eArchivedStatus.notArchived);
    Promise.resolve().then(() => (this.pageInfo.pageMessage = '📦Archive'));
    this.subscriptionRecipe = this.references.recipesReferenceObservable.subscribe((value) => {
      this.recipeReference = value!;
    });
    this.subscriptionIngredient = this.references.ingredientsReferenceObservable.subscribe((value) => {
      this.ingredientReference = value!;
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  changeDate(): void {
    const dateFrom = this.dateRange.get('dateFrom')?.value;
    const dateTo = this.dateRange.get('dateTo')?.value;
    const logs = this.dateRange.get('logs')?.value;

    this.loadData();
  }

  loadData(): void {
    const url = '/order_archives';
    let query = `page=${this.page}&limit=${this.pageSize}`;

    if (this.dateRange.get('dateFrom')?.value) {
      query += `&dateFrom=${this.datePipe.transform(
        this.dateRange.get('dateFrom')?.value,
        'yyyy-MM-dd'
      )}`;
    }

    if (this.dateRange.get('dateTo')?.value) {
      query += `&dateTo=${this.datePipe.transform(
        this.dateRange.get('dateTo')?.value,
        'yyyy-MM-dd'
      )}`;
    }

    if (this.dateRange.get('logs')) {
      this.logs = this.dateRange.get('logs')?.value;
    }

    this.api.get(url, query).subscribe((data: any) => {
      this.storedArchives = data.body.payload.docs;
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
      this.paginator.length = data.body.payload.total;
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}

