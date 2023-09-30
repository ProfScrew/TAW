import { Component, Output } from '@angular/core';

@Component({
  selector: 'checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.sass']
})
export class CheckboxComponent {
  @Output() checked: boolean = false;
}
