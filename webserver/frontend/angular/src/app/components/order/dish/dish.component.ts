import { Component, Input } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Color } from 'src/app/@types/color';

type ModType = 'more' | 'less' | 'with' | 'without';



@Component({
  selector: 'order-dish',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.sass'],
})
export class DishComponent {
  @Input() name:  string   = "<Dish name>"
  @Input() price: number   = 0.0;
  @Input() mods:  {name: string, type: ModType}[] = [];
  @Input() color: Color    = Color.SLATE;

  status = Math.random() < 0.1 ? 'cancelled' : Math.random() > 0.9 ? 'completed' : Math.random() > 0.8 ? 'waiting' : Math.random() < 0.2 ? 'ready' : '';
}
