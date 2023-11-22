
import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TitleStrategy } from '@angular/router';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { ApiService } from 'src/app/core/services/api.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent {
  dynamicFormGroup: FormGroup = new FormGroup({});
  @Input() model: iDynamicForm | undefined;

  singleElementsFromDatabase: any[] = [];
  multipleElementsFromDatabase: any[] = [];

  constructor(private api: ApiService, private notifier: NotifierComponent) {
    console.log(this.model);
  }

  ngOnInit(): void {
    if (this.model == undefined) {
      console.log("model is undefined");
    } else {//build form
      console.log(this.model);

      this.buildForm();
    }
  }


  buildForm() {
    console.log("build form");

    const formGroupField = this.getFormControlsFields();

    this.dynamicFormGroup = new FormGroup(formGroupField);
  }

  getFormControlsFields() {
    const formGroupField: any = {};

    // Text fields  ✅
    if (this.model?.textFields !== undefined) {
      for (const field of this.model?.textFields!) {
        formGroupField[field.name] = new FormControl();
      }
    }

    // Checkboxes ✅
    if (this.model?.checkBoxes !== undefined) {
      formGroupField[this.model?.checkBoxes.name] = new FormGroup({});
      for (const field of this.model?.checkBoxes.elements) {
        formGroupField[this.model.checkBoxes.name].addControl(field.name, new FormControl(false));
      }
    }

    //array text fields
    //array of groups of text fields
    if (this.model?.arrayTextFields !== undefined) {
      formGroupField[this.model?.arrayTextFields.name] = new FormArray([]);
    }

    //elements from database single choice
    if (this.model?.elementsFromDatabaseSingleChoice !== undefined) {
      for (const field of this.model?.elementsFromDatabaseSingleChoice) {
        //verify extract data from database=???
        //option 
        formGroupField[field.name] = new FormControl();
        this.api.get(field.route).subscribe((data: any) => {


          let temp = [] as any
          for (const element of data.body.payload) {
            temp.push(element);
          }
          this.singleElementsFromDatabase.push(temp);
        });
        console.log('AAAAAAAAAAAAAAAAAAb');


      }
    }

    //elements from database multiple choice
    if (this.model?.elementsFromDatabaseMultipleChoice !== undefined) {
      for (const field of this.model?.elementsFromDatabaseMultipleChoice) {
        formGroupField[field.name] = new FormControl();
        this.api.get(field.route).subscribe((data: any) => {

          let temp = [] as any
          for (const element of data.body.payload) {
            temp.push(element);
          }

          this.multipleElementsFromDatabase.push(temp);
          console.log(this.multipleElementsFromDatabase);
        });
      }
    }

    return formGroupField;
  }
  //arraytextfields

  get ElementsArray(): FormArray {
    return this.dynamicFormGroup.controls[this.model?.arrayTextFields?.name!] as FormArray;
  }
  addElementArray() {
    const newElement = new FormGroup({});

    newElement.addControl(this.model?.arrayTextFields?.name!, new FormControl(''));
    this.ElementsArray.push(newElement);
  }

  deleteElementArray(elementIndex: number) {
    this.ElementsArray.removeAt(elementIndex);
  }
  onSubmit() {
    console.log(this.dynamicFormGroup.value);

    const formData = this.dynamicFormGroup.value;
    console.log(formData);
    if (formData.password == '' || formData.password == 'newPassword') {
      formData.password = undefined;
    }
    if (this.model?.route !== undefined) {
      this.api.post(this.model.route, formData).subscribe({
        next: (response) => {
          console.log(response);
          this.notifier.showSuccess(response.status, response.body.message);
        },
        error: (err) => {
          //console.log(err);
          this.notifier.showError(err.status, err.error.message);
        }
      });
    } else {
      this.notifier.showError(500, "Route is undefined");
    }
  }


}
