import { Component, Input } from '@angular/core';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.css']
})

export class DynamicTableFormComponent {
  @Input() model: iDynamicTableForm | undefined;




  constructor() { }


  ngOnInit(): void {
    console.log("not hello ",this.model)
    if (this.model == undefined) {
      console.log("model is undefined");
    } else {//build form
      this.buildForm();
      console.log(this.model);
    }
  }

  buildForm() {
    // this.dynamicFormGroup = new FormGroup(formGroupField);

  }

}
