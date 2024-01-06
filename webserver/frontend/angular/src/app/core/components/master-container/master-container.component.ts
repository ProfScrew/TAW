import { Component, ViewChild } from '@angular/core';
import { Router,ActivatedRoute, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { PageInfoService } from '../../services/page-info.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DatabaseReferencesService } from '../../services/database-references.service';
import { SocketService } from '../../services/socket.service';
import { eListenChannels } from '../../models/channels.enum';
import { NotifierComponent } from '../notifier/notifier.component';
import { iCourse, iOrder } from '../../models/order.model';

@Component({
  selector: 'app-master-container',
  templateUrl: './master-container.component.html',
  styleUrls: ['./master-container.component.css'],
})
export class MasterContainerComponent {
  @ViewChild('drawer') drawer!: MatDrawer;

  counterCourses = 0;

  items = [
    {
      name: 'Admin',
      subItems: [
        'Users',
        'Categories',
        'Recipes',
        'Ingredients',
        'Info Restaurant',
        'Rooms',
        'Tables',
      ],
      subLinks: [
        '/core/admin/users',
        '/core/admin/categories',
        '/core/admin/recipes',
        '/core/admin/ingredients',
        '/core/admin/info-restaurant',
        '/core/admin/rooms',
        '/core/admin/tables',
      ],
    },
    {
      name: 'Waiter',
      subItems: ['Orders', 'Ready'],
      subLinks: ['/core/waiter/orders', '/core/waiter/ready'],
    },
    {
      name: 'Production',
      subItems: ['Queue'],
      subLinks: ['/core/production/queue'],
    },
    {
      name: 'Cashier',
      subItems: ['Cashout', 'Tables'],
      subLinks: ['/core/cashier/cashout', '/core/cashier/tables'],
    },
    {
      name: 'Analytics',
      subItems: ['Archive','Statistics'],
      subLinks: ['/core/analytics/archive','/core/analytics/statistics'],
    },
  ];

  showFiller = true;
  Breakpoints = Breakpoints;
  currentBreakpoint: string = '';

  readonly breakpoint$ = this.breakpointObserver
    .observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
    ])
    .pipe(
      //tap((value) => console.log(value)),
      distinctUntilChanged()
    );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected auth: AuthService,
    private api: ApiService,
    protected pageInfo: PageInfoService,
    private databaseReferences: DatabaseReferencesService,
    public socketServcie: SocketService,
    private notifier: NotifierComponent,
    private breakpointObserver: BreakpointObserver
  ) {

    databaseReferences.initializeAllReferences();
    //listen to new orders for serving
    if (this.isWaiter()) {
      this.initCounterCourses();
      this.socketServcie
        .listen(eListenChannels.orderReady)
        .subscribe((data) => {
          if (data.message == 'Added') {
            this.counterCourses++;
            this.notifier.showInfo(200, 'New Course Ready to be served','Message for Waiters',{timeOut: 5000,preventDuplicates:true});
          } else {
            this.counterCourses--;
          }
        });
    }
  }

  ngOnInit(): void {
    this.breakpoint$.subscribe(() => this.breakpointChanged());
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Access the current route's data or any other information you need
        const currentRouteData = this.activatedRoute.snapshot.data;

        this.api.setNotificationShown(false);
      });
  }

  private breakpointChanged() {
    if (this.breakpointObserver.isMatched(Breakpoints.Web)) {
      this.currentBreakpoint = Breakpoints.Web;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) {
      this.currentBreakpoint = Breakpoints.Tablet;
    } else if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.currentBreakpoint = Breakpoints.Handset;
    }

    Promise.resolve(null).then(() => (this.pageInfo.currentBreakpoint = this.currentBreakpoint));
  }

  initCounterCourses() {
    this.api.get('/orders/').subscribe((response) => {
      response.body.payload.forEach((order: iOrder) => {
        order.courses.forEach((course: iCourse) => {
          if (
            course.logs_course?.ready_course != undefined &&
            course.logs_course.served_course == undefined
          ) {
            this.counterCourses++;
          }
        });
      });
      if (this.counterCourses > 0) {
        this.notifier.showInfo(
          200,
          'There are ' + this.counterCourses + ' courses ready to be served','Message for Waiters',{timeOut: 5000}
        );
      }
    });
  }

  isSubItem(item: any): boolean {
    return item.subItems && item.subItems.length > 0;
  }

  isValidRole(item: string) {
    return (this.auth.role as any)[item.toLowerCase()];
  }

  isWaiter() {
    return this.auth.role['waiter'];
  }

  closeDrawer() {
    this.drawer.close();
  }

  exitApp() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToReady() {//shortcut for waiters serving
    this.router.navigate(['/core/waiter/ready']);
  }
}
