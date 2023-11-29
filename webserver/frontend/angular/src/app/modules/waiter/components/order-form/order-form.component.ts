import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})

export class OrderFormComponent {
  @Input() tableReference: any;
  @Input() roomReference: any;
  dataLoaded: boolean = false;
  OrderFormGroup: FormGroup = new FormGroup({});

  constructor() {
  }
  
  buildForm() {

    this.OrderFormGroup = new FormGroup({
      /*
      guests: new FormControl('', Validators.required),
      room: new FormControl(),
      tables: new FormControl(),
      */
    });

    this.OrderFormGroup.addControl('guests', new FormControl('', Validators.required));
    this.OrderFormGroup.addControl('room', new FormControl());
    this.OrderFormGroup.addControl('tables', new FormControl());
    setTimeout(() => {
      this.dataLoaded = true;
    }, 1000);
  }
  
  ngOnInit(): void {
    
    this.buildForm();
  }
  ngAfterViewInit(): void {
  }
  onSubmit() {
    console.log("hello")
  }
}
