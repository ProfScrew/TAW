import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-dynamic-table-form',
  templateUrl: './dynamic-table-form.component.html',
  styleUrls: ['./dynamic-table-form.component.css']
})

export class DynamicTableFormComponent {
  dynamicFormGroup: FormGroup = new FormGroup({});
  selectedValues: string[] = [];


  @Input() model: iDynamicTableForm | undefined;

  singleElementsFromDatabase: any[] = [];
  multipleElementsFromDatabase: any[] = [];



  constructor(private api: ApiService, private notifier: NotifierComponent) {

  }


  ngOnInit(): void {
    if (this.model == undefined) {
    } else {//build form
      this.buildForm();
    }
  }

  buildForm() {
    // this.dynamicFormGroup = new FormGroup(formGroupField);
    const formGroupField = this.getFormControlsFields();
    this.dynamicFormGroup = new FormGroup(formGroupField);

    
    if (this.model?.arrayTextFields !== undefined) {
      for (const field of this.model?.arrayTextFields?.value!) {
        this.addElementArray(field);
      }
    }
    //seting up selected value for multiple choice from database
  }

  getFormControlsFields() {
    const formGroupField: any = {};
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

    //array text fields ✅

    if (this.model?.arrayTextFields !== undefined) {
      formGroupField[this.model?.arrayTextFields.name] = new FormArray([]);

    }

    // Single select ✅
    if (this.model?.elementsFromDatabaseSingleChoice !== undefined) {
      for (const field of this.model?.elementsFromDatabaseSingleChoice) {
        formGroupField[field.name] = new FormControl();
        this.api.get(field.route).subscribe((data: any) => {
          const selectedValue = data.body.payload.find((element: any) => element._id === field.value);
          formGroupField[field.name].setValue(field.value);
          this.singleElementsFromDatabase.push(data.body.payload);
        });
      }
    }
    
    // Multiple select ✅
    if (this.model?.elementsFromDatabaseMultipleChoice !== undefined) {
      
      for (const field of this.model?.elementsFromDatabaseMultipleChoice) {
        formGroupField[field.name] = new FormControl();
        this.api.get(field.route).subscribe((data: any) => {

          let temp = [] as any
          for (const element of data.body.payload) {
            if(field.value.includes(element._id)){
              element.checked = true;
            }
            temp.push(element);
          }

          const selectedValues = [];
          for (const element of temp) {
            if (element.checked) {
              selectedValues.push(element._id);
            }
          }
          formGroupField[field.name].setValue(selectedValues);
          this.multipleElementsFromDatabase.push(temp);
        });
      }
    }
    return formGroupField;
  }



  //arraytextfields ✅

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

  onDelete(){
    this.api.delete(this.model?.routeDelete!).subscribe({
      next: (response) => {
        this.notifier.showSuccess(response.status, response.body.message);
      },
      error: (error) => {
        this.notifier.showError(error.status, error.error.message);
      }
    })
  }
  onSubmit() {
    console.log(this.dynamicFormGroup.value);
    this.api.put(this.model?.routeModify!, this.dynamicFormGroup.value).subscribe({
      next: (response) => {
        this.notifier.showSuccess(response.status, response.body.message);
      }, error: (error) => {
        this.notifier.showError(error.status, error.error.message);
      }
    });
  }



}
