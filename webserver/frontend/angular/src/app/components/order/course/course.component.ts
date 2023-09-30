import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishComponent } from '../dish/dish.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Color, randomColor } from 'src/app/@types/color';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { InputComponent } from '../../input/input.component';



@Component({
  selector: 'order-course',
  standalone: true,
  imports: [CommonModule, DishComponent, ModalComponent, ButtonComponent, InputComponent],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.sass']
})
export class CourseComponent {
  @Input() dishes!: {
    name:  string,
    price: number,
    mods:  {name: string, type: 'more' | 'less' | 'with' | 'without'}[],
    color: Color,
  }[];

  @Input() name: string = "Course name";

  @ViewChild(ModalComponent) modal!:   ModalComponent;
  @ViewChild(InputComponent) newname!: InputComponent;

  options() {
    this.modal.setOptions([
      { type: 'info',  text: 'Rename'  },
      { type: 'unset', text: 'Cancel' }
    ]);

    this.modal.title = 'Rename course'
    this.newname.value = '';
    this.newname.placeholder = 'New name';
    this.newname.hideError();
    this.modal.show();
    console.log('Showing modal');
  }

  modalError(msg: string) {
    this.modal.handleError();
    this.newname.showError(msg);
  }

  handleRename(evt: number) {
    console.log('Renaming course', evt);
    
    if (evt === 1) return this.modal.hide();
    const name = this.newname.value;

    if (!name)              return this.modalError('Name cannot be empty');
    if (name === this.name) return this.modal.hide();

    console.log('Renaming course to', this.newname.value);
    this.name = this.newname.value;
    this.modal.hide();
  }
}
