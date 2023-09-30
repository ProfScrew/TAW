import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from 'src/app/@types/color';
import { MenuViewComponent } from 'src/app/components/menu/view/view.component';

@Component({
  selector: 'waiter-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.sass']
})
export class WaiterMenuComponent {
  constructor(private route: ActivatedRoute, private router: Router) { }
  public orderid: string = this.route.snapshot.params['orderid'];

  public choices_visible: boolean = false;
  public color: Color = Color.SLATE;

  @ViewChild(MenuViewComponent) menu!: MenuViewComponent;


  

  toggle_choices(open=!this.choices_visible): void {
    this.choices_visible = open;
  }

  select_submenu(event: Event|null, id: string, color: string): void {
    event?.stopPropagation();
    event?.preventDefault();

    this.color = this.menu.generate();

    document.querySelector('.choice.selected')?.classList.remove('selected');
    (document.querySelector('.submenu-selector > span') as HTMLElement).innerText = id;
    
    if (event?.target)
      (event?.target as HTMLElement).classList.add('selected');

    this.toggle_choices(false);
    console.log('select_submenu', id);    
  }
}
