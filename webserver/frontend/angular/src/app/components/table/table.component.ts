import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalOption } from '../modal/modal.component';

import { TableOptions } from './table.config';
import { TableStatus } from 'src/app/services/table.service';
import { InputComponent } from '../input/input.component';
import { UserInteractionComponent } from '../interaction/interaction.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ModalComponent, InputComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass'],
})

export class TableComponent extends UserInteractionComponent {
  @Input() id:     string = '0';
  @Input() status: TableStatus = TableStatus.UNSET;

  @ViewChild(ModalComponent) modal?: ModalComponent;

  is_modal_visible: boolean     = true;
  is_opening_procedure: boolean = false;
  is_left_click: boolean        = true;

  reservation_time?: Date       = undefined;
  reservation_name?: string     = undefined;
  guests: number                = 0;

  constructor() { super();}


  updateGuests(guests: string) {
    const num = parseInt(guests);
    if (isNaN(num) || num < 1) this.modal?.handleError();
    else this.guests = num;
  }

  handleLeftClick(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();

    super.onTap(evt);

    this.is_left_click = true;

    const modal = this.modal;
    if (!modal) return;

    this.is_opening_procedure = false;
    modal.title = `Options for Table #${this.id}`
    modal.type  = 'unset';
    modal.setOptions(TableOptions.left_click[this.status] as ModalOption[]);

    switch (this.status) {
      case TableStatus.UNSET:
        this.is_opening_procedure = true;
        break;

      case TableStatus.LOCKED:
        modal.type = 'error'
        break;

      case TableStatus.RESERVED:
        modal.type = 'important'
        break;
    }

    modal.show();
  }

  handleRightClick(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();

    super.onLongPress(evt);

    this.is_left_click = false;

    const modal = this.modal;
    if (!modal) return;

    this.is_opening_procedure = false;
    modal.title = `Options for Table #${this.id}`
    modal.type  = 'unset';
    modal.setOptions(TableOptions.right_click[this.status] as ModalOption[]);

    if (TableOptions.right_click[this.status].length === 0) { return; }

    switch (this.status) {
      case TableStatus.UNSET:
        this.is_opening_procedure = true;
        break;

      case TableStatus.LOCKED:
        modal.type    = 'error'
        break;

      case TableStatus.RESERVED:
        // modal.type    = 'important'
        break;
    }

    modal.show();
  }
}
