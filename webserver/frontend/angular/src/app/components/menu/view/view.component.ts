import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { iRecipe } from 'src/app/@types/recipe';
import { Color, randomColor } from 'src/app/@types/color';
import { MenuItemComponent } from '../item/item.component';



function randomRecipe(): iRecipe {
  const noItems = Math.floor(Math.random() * 5) + 2;
  return {
    name: 'Item ' + Math.random().toString(36).substring(7) + ' ' + Math.random().toString(36).substring(7),
    ingredients: new Array(noItems).fill(0).map((_, i) => {
      return {
        name: 'Item ' + Math.random().toString(36).substring(7) + ' ' + i + ' ' + Math.random().toString(36).substring(7),
        alergens: [''],
        price_per_unit: 10 + i,
        unit: 'g',
      }
    }),
    base_price: 5 + Math.floor(Math.random() * 15),
    submenu: {
      name: 'Submenu ' + Math.random().toString(36).substring(7),
      color: randomColor(),
    }
  }
}

@Component({
  selector: 'app-menu-view',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class MenuViewComponent {
  public orderid:       string  = this.route.snapshot.params['orderid'];
  private is_selecting: boolean = false;

  @Input() color: Color     = Color.SLATE;
  @Input() items: iRecipe[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.items = new Array(10).fill(0).map((_, i) => randomRecipe());
    this.color = randomColor();
  }

  generate(count=10): Color {
    this.items = new Array(count).fill(0).map((_, i) => randomRecipe());
    this.color = randomColor();

    return this.color;
  }
}
