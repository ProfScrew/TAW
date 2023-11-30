import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})

export class OrderFormComponent {
  @Input() tableReference: any;
  @Input() roomReference: any;

  chosenRoom: any;
  RoomTablesList: any;
  OrderFormGroup: FormGroup = new FormGroup({});

  constructor(public notifier: NotifierComponent, private api : ApiService) {
    this.buildForm();
  }
  
  buildForm() {

    this.OrderFormGroup = new FormGroup({
      guests: new FormControl('', Validators.required),
      room: new FormControl(),
      tables: new FormControl(),
    });
    this.RoomTablesList = []
  }
  
  selectRoom(_id: string) {
    this.chosenRoom = _id;
    this.RoomTablesList = this.tableReference.filter((table: any) => table.room === this.chosenRoom);
    this.RoomTablesList = this.RoomTablesList.filter((table: any) => table.status === 'free');
  }


  ngOnInit(): void {
    
  }
  
  ngAfterViewInit(): void {
  }
  onSubmit() {
    console.log(this.OrderFormGroup.value);
    let value = this.OrderFormGroup.value;
    let capacity = 0;
    for (let table of value.tables) {
      console.log(table);

      capacity += this.tableReference.find((tableRef: any) => tableRef._id === table).capacity;

    }
    value.capacity = capacity;
    if(value.guests > value.capacity) {
      this.notifier.showWarning(400, "Too many guests for the selected tables")
      return;
    }else{
      this.api.post('/orders', value).subscribe((res: any) => {
        console.log(res);
        this.notifier.showSuccess(res.status,res.body.message)
      }, (err: any) => {
        console.log(err);
        this.notifier.showError(err.status, err.error.message)
      })
    }

  }
}
