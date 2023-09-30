import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInteractionComponent } from 'src/app/components/interaction/interaction.component';
import { MenuViewComponent } from 'src/app/components/menu/view/view.component';

@Component({
  selector: 'menu-item',
  templateUrl: './menu.item.html',
  standalone: true,
  styleUrls: ['./menu.item.sass']
})
export class MenuItemComponent extends UserInteractionComponent {
    @Input() color: string = 'red';

    @Input() name: string = '<Recipe name>';
    @Input() available: boolean = true;
    @Input() price: number = 0;


    ngOnInit(): void {
      
    }

    handleTap(event: Event): void {
      event.preventDefault()
      event.stopPropagation()

      super.onTap(event);
    }

    handleLongPress(event: Event): void {
      event.preventDefault()
      event.stopPropagation()
      
      super.onLongPress(event);
    }
}
