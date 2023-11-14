import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iRole, iUser } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  
  userForm: FormGroup;

  roles: iRole = {
    admin: false,
    waiter: false,
    production: false,
    cashier: false,
    analytics: false,
  };

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: this.fb.group(this.roles),
    });
  }

  onSubmit() {
    // Handle form submission logic
    const formData: iUser = this.userForm.value;
    console.log(formData);
  }

}
 