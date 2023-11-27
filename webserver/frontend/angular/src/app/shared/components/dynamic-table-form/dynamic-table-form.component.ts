import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.css']
})

export class DynamicTableFormComponent {
  dynamicFormGroup: FormGroup = new FormGroup({});



  @Input() model: iDynamicTableForm | undefined;

  singleElementsFromDatabase: any[] = [];
  multipleElementsFromDatabase: any[] = [];



  constructor(private api: ApiService) {

  }


  ngOnInit(): void {
    console.log("not hello ", this.model)
    if (this.model == undefined) {
      console.log("model is undefined");
    } else {//build form
      this.buildForm();
      console.log(this.model);
    }
  }

  buildForm() {
    // this.dynamicFormGroup = new FormGroup(formGroupField);
    const formGroupField = this.getFormControlsFields();
    this.dynamicFormGroup = new FormGroup(formGroupField);

    
    if (this.model?.arrayTextFields !== undefined) {
      for (const field of this.model?.arrayTextFields?.value!) {
        console.log("field", field)
        this.addElementArray(field);
      }
    }
  }

  getFormControlsFields() {
    const formGroupField: any = {};
    console.log("hello there", this.model)
    // Text fields  ✅
    if (this.model?.textFields !== undefined) {
      for (const field of this.model?.textFields!) {
        formGroupField[field.name] = new FormControl();
        formGroupField[field.name].setValue(field.value);
      }
    }

    // Checkboxes ✅
    if (this.model?.checkBoxes !== undefined) {
      formGroupField[this.model?.checkBoxes.name] = new FormGroup({});
      for (const field of this.model?.checkBoxes.elements) {
        formGroupField[this.model.checkBoxes.name].addControl(field.name, new FormControl(field.value));
        

      }
    }

    //array text fields

    if (this.model?.arrayTextFields !== undefined) {
      formGroupField[this.model?.arrayTextFields.name] = new FormArray([]);

    }

    // Single select ✅
    if (this.model?.elementsFromDatabaseSingleChoice !== undefined) {
      /*
      formGroupField[this.model?.elementsFromDatabaseSingleChoice.name] = new FormControl();
      this.api.get(this.model?.elementsFromDatabaseSingleChoice.route!).subscribe((data: any) => {
        this.singleElementsFromDatabase = data.body.payload;
      });
      */
    }
    
    // Multiple select ✅
    if (this.model?.elementsFromDatabaseMultipleChoice !== undefined) {
      console.log("single choice", this.model?.elementsFromDatabaseMultipleChoice)
      
      for (const field of this.model?.elementsFromDatabaseMultipleChoice) {
        formGroupField[field.name] = new FormControl();
        this.api.get(field.route).subscribe((data: any) => {

          let temp = [] as any
          for (const element of data.body.payload) {
            element.checked = true;
            temp.push(element);
          }
          console.log("temp", temp)

          this.multipleElementsFromDatabase.push(temp);
        });
      }
      /*
      formGroupField[this.model?.elementsFromDatabaseMultipleChoice.name] = new FormControl();
      this.api.get(this.model?.elementsFromDatabaseMultipleChoice.route!).subscribe((data: any) => {
        this.multipleElementsFromDatabase = data.body.payload;
      });
      */
    }
    return formGroupField;
  }



  //arraytextfields

  get ElementsArray(): FormArray {
    return this.dynamicFormGroup.controls[this.model?.arrayTextFields?.name!] as FormArray;
  }
  addElementArray(value?: any) {
    const newElement = new FormGroup({});
    newElement.addControl(this.model?.arrayTextFields?.name!, new FormControl(value? value: ''));
    this.ElementsArray.push(newElement);
  }
  deleteElementArray(elementIndex: number) {
    this.ElementsArray.removeAt(elementIndex);
  }


  onSubmit() {
    console.log("submitted");
    console.log(this.dynamicFormGroup.value);
  }



}
