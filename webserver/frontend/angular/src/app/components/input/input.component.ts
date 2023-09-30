import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

type InputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'time' | 'datetime-local';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass']
})
export class InputComponent {
  @Input() type: InputType = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  // @Input() value: string|number = '';  
  @Input() disabled: boolean = false;
  @Input() readonly: string = 'false';
  @Input() required: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() color: string = '';
  
  error?: string = undefined;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<string>();

  @ViewChild('internalInput') input!: ElementRef<HTMLInputElement>;


  constructor() {
  }

  get value() {
    return this.input.nativeElement.value;
  }

  set value(value: string) {
    this.input.nativeElement.value = value;
  }

  onChange(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    const input = evt.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
  
  onBlur(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    const input = evt.target as HTMLInputElement;
    this.blur.emit(input.value);
  }

  showError(error: string) {
    this.error = error;
  }

  hideError() {
    this.error = undefined;
  }
}
