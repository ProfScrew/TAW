import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { iRole, iUser } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  hide = true;
  userForm: FormGroup;

  roles: iRole = {
    admin: false,
    waiter: false,
    production: false,
    cashier: false,
    analytics: false,
  };

  rolesList: string[] = ['admin', 'waiter', 'production', 'cashier', 'analytics'];

  constructor(private fb: FormBuilder, private api: ApiService) {



    this.userForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['',[Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', Validators.required],
      role: this.fb.group(this.roles),

    });
  }


  onSubmit() {
    // Handle form submission logic
    const formData: iUser = this.userForm.value;
    console.log(formData);

    this.api.post('/users', formData).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });


  }

}
 