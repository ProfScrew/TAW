import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInteractionComponent } from '../../interaction/interaction.component';
import { Color } from 'src/app/@types/color';


@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class MenuItemComponent extends UserInteractionComponent {
  @Input() color: Color = Color.SLATE;

  @Input() name:      string  = '<Recipe name>';
  @Input() available: boolean = true;
  @Input() price:     number  = 0;

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
