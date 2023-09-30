import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { sleep } from '../../util/sleep';
import { UserInteractionComponent } from '../interaction/interaction.component';

export type ModalOptionType = ('info' | 'warn' | 'error' | 'success' | 'unset' | 'important')
export type ModalOption     = { type: ModalOptionType, text: string }

const ANIMATION_TIME = 0; // ms

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
  imports: [NgFor, NgIf]
})
export class ModalComponent extends UserInteractionComponent {
  hidden: boolean = true;
  wrong:  boolean = false;
  options: ModalOption[] = [
    { type: 'info',  text: 'Open order'  },
    { type: 'unset', text: 'Cancel' },
    { type: 'error', text: 'Close order' },
  ];

  @Input() title:   string = ''
  @Input() message?: string = '';
  @Input() type:    ModalOptionType = 'unset';

  @Output() onButtonPress = new EventEmitter<number>();
  @Output() close         = new EventEmitter<void>();

  /**
   * Show the modal blurring out the background components
   * @returns void
   */
  public show() { this.hidden = false; }

  /**
   * Hide the modal and emit the close event
   * @param isCloseEvent {boolean} Whether to emit the close event or not
   *                               (default: `true`)
   * @returns void
   * @emits close
   */
  public hide(isCloseEvent: boolean = true) { 
    this.hidden = true;

    if (isCloseEvent) { 
      sleep(ANIMATION_TIME).then(() => this.close.emit());
    }
  }


  /**
   * Changes the options of the modal
   * @param options {ModalOption[]} The new options
   */
  public setOptions(options: ModalOption[]) {
    this.options = options;
  }

  /**
   * Clears the options of the modal
   * @returns void
   */
  public clearOptions() {
    this.options = [];
  }

  async handleError() {
    super.onError();
    this.wrong = true;
    await sleep(500);
    this.wrong = false;
  }

  /**
   * Handles the click event of the modal
   * @param index {number} The index of the option clicked
   * @returns void
   * @emits leftClick
   */
  async handleClick(index: number) {
    const option = this.options[index];
    sleep(ANIMATION_TIME).then(() => this.onButtonPress.emit(index));
    // this.hide(false);
    
  }
}
