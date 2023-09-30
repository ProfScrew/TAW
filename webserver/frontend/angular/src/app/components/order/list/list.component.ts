import { Component, ViewChild } from '@angular/core';
import { Color, randomColor } from 'src/app/@types/color';
import { ModalComponent } from '../../modal/modal.component';
import { InputComponent } from '../../input/input.component';
import { SelectComponent } from '../../select/select.component';
import { UserInteractionComponent } from '../../interaction/interaction.component';

type dish = {
    name:  string,
    price: number,
    mods:  {name: string, type: 'more' | 'less' | 'with' | 'without'}[],
    color: Color,
}

function randomMod(): {name: string, type: 'more' | 'less' | 'with' | 'without'} {
  const types = ['more', 'less', 'with', 'without'];
  const type = types[Math.floor(Math.random() * types.length)] as 'more' | 'less' | 'with' | 'without';
  return {name: 'Modification', type: type};
}



@Component({
  selector: 'order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent extends UserInteractionComponent {
  courses: {
    name: string,
    dishes: dish[],
  }[] = [
    { name: "First course",  dishes: [
      { name: "Dish 1", price: 0.0, mods: [randomMod(), randomMod(), randomMod()], color:randomColor() },
      { name: "Dish 2", price: 0.0, mods: [randomMod()], color:randomColor() },
      { name: "Dish 3", price: 0.0, mods: [randomMod()], color:randomColor() },
      { name: "Dish 4", price: 0.0, mods: [randomMod()], color: randomColor() }
    ]},

    { name: "Second course", dishes: [
      // { name: "Dish 1", price: 0.0, mods: [randomMod(), randomMod()], color:randomColor() },
      // { name: "Dish 2", price: 0.0, mods: [randomMod()], color:randomColor() },
      // { name: "Dish 3", price: 0.0, mods: [randomMod()], color:randomColor() },
    ]},
  ];


  @ViewChild(ModalComponent)  modal!:  ModalComponent;
  @ViewChild(SelectComponent) select!: SelectComponent<number>;

  modalError(msg: string) {
    this.modal.handleError();
    this.select.showError(msg);
  }

  showModal() {
    super.onTap(new Event('tap'));
    this.modal.setOptions([
      { type: 'info',  text: 'Add' },
      { type: 'unset', text: 'Cancel' }
    ]);

    this.select.unselect();
    this.select.hideError();
    this.select.options = [
      {name: 'Drinks', value: 1},
      {name: 'First course', value: 2},
      {name: 'Second course', value: 3},
      {name: 'Third course', value: 4},
      {name: 'Fourth course', value: 5}
    ]

    this.modal.title = 'Add course'
    
    this.modal.show();
    console.log('Showing modal');
  }

  addCourse(btn: number) {
    if (btn === 1) return this.modal.hide();
    const key = this.select.key;
    const value = this.select.value;

    if (!key || !value) return this.modalError('Please select a course');
    
    console.log('Adding course', key, value);
    this.courses.push({name: key, dishes: []});
    this.modal.hide();
  }
}
