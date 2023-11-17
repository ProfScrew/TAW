import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { iRole, iUser } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent {
  userForm: FormGroup;

  users: iUser[] = [];
  userForms: FormGroup[] = [];

  userFormArray: [iUser, FormGroup][] = [];


  roles: iRole = {
    admin: false,
    waiter: false,
    production: false,
    cashier: false,
    analytics: false,
  };

  rolesList: string[] = ['admin', 'waiter', 'production', 'cashier', 'analytics'];

  constructor(private fb: FormBuilder, private api: ApiService, private socketService: SocketService, private notifier: NotifierComponent) {



    this.userForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', Validators.required],
      role: this.fb.group(this.roles),
    });





    this.socketService.joinRoom('admin');
    this.socketService.listen('userListUpdated').subscribe((data) => {
      console.log('User list updated:', data);
      // Update your UI as needed
      this.getUsersUpdate();
    });

    // this.socketService.listen('userListUpdated').subscribe((data) => {
    //   console.log('User list updated:', data);
    //   // Update your UI as needed
    // });


  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    //this.userFormArray = [];
    this.api.get('/users').subscribe({
      next: (response) => {
        let data = response.body;
        this.users = data.payload;
        for (let singleUser of data.payload) {

          this.userFormArray.push([singleUser as iUser, this.fb.group({
            username: [singleUser.username, Validators.required],
            name: [singleUser.name, Validators.required],
            surname: [singleUser.surname, Validators.required],
            phone: [singleUser.phone, [Validators.required, Validators.pattern('[0-9]{10}')]],
            password: ['newPassword', Validators.required],
            role: this.fb.group(singleUser.role as iRole),
          })]);

        }
      },
      error: (err) => {
        //console.log(err);
        this.notifier.showError(err.status, err.error.message);
      }
    });
  }


  getUsersUpdate() {
    //this.userFormArray = [];
    this.api.get('/users').subscribe({
      next: (response) => {
        let data = response.body
        console.log(data);
        this.users = data.payload;
        for (let backendUser of data.payload) {
          let found = false;
          for (let existingUser of this.userFormArray) {
            if (backendUser.username == existingUser[0].username) {
              found = true;
              if (backendUser !== existingUser[0]) {
                console.log("update");
                existingUser[0] = backendUser;
                existingUser[1] = this.fb.group({
                  username: [backendUser.username, Validators.required],
                  name: [backendUser.name, Validators.required],
                  surname: [backendUser.surname, Validators.required],
                  phone: [backendUser.phone, [Validators.required, Validators.pattern('[0-9]{10}')]],
                  password: ['password', Validators.required],
                  role: this.fb.group(backendUser.role as iRole),
                });
                //this.userFormArray.splice(this.userFormArray.indexOf(existingUser), 1);
              }
            } 
          }
          if (!found) {
            console.log("add");
            this.userFormArray.push([backendUser as iUser, this.fb.group({
              username: [backendUser.username, Validators.required],
              name: [backendUser.name, Validators.required],
              surname: [backendUser.surname, Validators.required],
              phone: [backendUser.phone, [Validators.required, Validators.pattern('[0-9]{10}')]],
              password: ['newPassword', Validators.required],
              role: this.fb.group(backendUser.role as iRole),
            })]);
          }
        }
        for(let existingUser of this.userFormArray){
          let found = false;
          for(let backendUser of data.payload){
            if(backendUser.username == existingUser[0].username){
              found = true;
            }
          }
          if(!found){
            console.log("delete");
            this.userFormArray.splice(this.userFormArray.indexOf(existingUser), 1);
          }
        }
      },
      error: (err) => {
        this.notifier.showError(err.status, err.error.message);
        //console.log(err);
      }
    });
  }


  onChangeUser(username: string) {
    for (let user of this.userFormArray) {
      if (user[0].username == username) {//review the put method
        this.api.put('/users/' + username, user[1].value as iUser).subscribe({
          next: (response) => {
            //console.log(data);
            this.notifier.showSuccess(response.status, response.body.message);
          },
          error: (err) => {
            //console.log(err);
            this.notifier.showError(err.status, err.error.message);
          }
        });
      }
    }
  }

  onDeleteUser(username: string) {
    this.api.delete('/users/' + username).subscribe({
      next: (response) => {
        //console.log(data);
        this.notifier.showSuccess(response.status, response.body.message);
      },
      error: (err) => {
        //console.log(err);
        this.notifier.showError(err.status, err.error.message);
      }
    });
  }

  onSubmit() {
    // Handle form submission logic
    const formData: iUser = this.userForm.value;
    console.log(formData);
    
    if(formData.password == '' || formData.password == 'newPassword'){
      formData.password = undefined;
    }
    
    this.api.post('/users', formData).subscribe({
      next: (response) => {
        console.log(response);
        this.notifier.showSuccess(response.status, response.body.message);
      },
      error: (err) => {
        //console.log(err);
        this.notifier.showError(err.status, err.error.message);
      }
    });


  }

}
