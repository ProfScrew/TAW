import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.sass']
})
export class SelectComponent<ValueType> {
  @Input()             options: {name: string, value: ValueType}[] = [];
  @Output() change: EventEmitter<ValueType> = new EventEmitter<ValueType>();
  @ViewChild('select') select!: ElementRef<HTMLSelectElement>;
  error?: string = undefined;

  get value(): (ValueType|undefined) {
    const idx = this.select.nativeElement.selectedIndex - 1;
    if (idx < 0) return undefined;
    return this.options[idx].value;
  }

  set value(value: ValueType) {
    const index = this.options.findIndex((option) => option.value === value);
    if (index === -1) return;
    this.select.nativeElement.selectedIndex = index;
  }

  get key(): (string|undefined) {
    const idx = this.select.nativeElement.selectedIndex - 1;
    if (idx < 0) return undefined;
    return this.options[idx].name;
  }

  set key(key: string) {
    const index = this.options.findIndex((option) => option.name === key);
    if (index === -1) return;
    this.select.nativeElement.selectedIndex = index;
  }

  constructor() {}

  onChange(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    console.debug('Select changed', this.value);

    this.select.nativeElement.blur();
    this.change.emit(this.value);
  }

  unselect() {
    this.select.nativeElement.selectedIndex = 0;
  }

  showError(error: string) {
    this.error = error;
  }

  hideError() {
    this.error = undefined;
  }
}
