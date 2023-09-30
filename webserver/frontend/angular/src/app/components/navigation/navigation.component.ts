import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent {
  @Input() title: string = '';

  opened: boolean = false;
  links: { name: string, path: string }[] = []

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }
}
