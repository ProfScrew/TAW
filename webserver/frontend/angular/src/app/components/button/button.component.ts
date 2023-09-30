import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonType = 'success' | 'danger' | 'warning' | 'info' | 'important' | '';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent {
  @Input() disabled: unknown = false;
  @Input() type: ButtonType  = '';
  @Input() size: '' | 'full' = 'full';
  constructor() {}

  @Output() leftClick:  EventEmitter<void> = new EventEmitter<void>();
  @Output() rightClick: EventEmitter<void> = new EventEmitter<void>();

  click(evt: Event, left: boolean=true) {
    evt.stopPropagation();
    evt.preventDefault();

    if (left) this.leftClick.emit();
    else      this.rightClick.emit();
  }
}
