import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { iRole, iUser } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { NotifierComponent } from 'src/app/core/components/notifier/notifier.component';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { Output, EventEmitter } from '@angular/core';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { iDynamicTable } from 'src/app/core/models/dynamic_table.model';
import { iDynamicTableForm } from 'src/app/core/models/dynamic_table_form.model';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent {


  users: iUser[] = [];
  userForms: FormGroup[] = [];

  userFormArray: [iUser, FormGroup][] = [];

  modelInput: iDynamicForm = {
    route: '/users',
    formName: 'newUser',
    textFields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'surname',
        label: 'Surname',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        required: true,
        value: '',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        value: '',
      },
    ],
    checkBoxes: {
      name: 'role',
      elements: [
        {
          name: 'admin',
          label: 'Admin',
          value: false,
        },
        {
          name: 'waiter',
          label: 'Waiter',
          value: false,
        },
        {
          name: 'production',
          label: 'Production',
          value: false,
        },
        {
          name: 'cashier',
          label: 'Cashier',
          value: false,
        },
        {
          name: 'analytics',
          label: 'Analytics',
          value: false,
        }
      ]
    },
    
    elementsFromDatabaseMultipleChoice: [
      {
        name: 'room',
        label: 'Rooms',
        route: '/rooms/',
        value: [],
      },
      
      {
        name: 'category',
        label: 'Categories',
        route: '/categories/',
        value: [],
      },
    ],
  }
  
  modelTable: iDynamicTable = {
    route: '/users/',

    shadow: false,
    columns: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
      },
      {
        name: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        name: 'surname',
        label: 'Surname',
        type: 'text',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
      },
    ],
    expandable: true,
    subModelInput: {
      ...this.modelInput as Partial<iDynamicTableForm>,
      formName: 'modifyUser',
      routeModify: '/users/',
      routeDelete: '/users/',

    }

  };
  
  
  roles: iRole = {
    admin: false,
    waiter: false,
    production: false,
    cashier: false,
    analytics: false,
  };

  rolesList: string[] = ['admin', 'waiter', 'production', 'cashier', 'analytics'];

  constructor(private fb: FormBuilder, private api: ApiService, private socketService: SocketService, private notifier: NotifierComponent, private pageInfo: PageInfoService) {


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
    Promise.resolve().then(() => this.pageInfo.setPageMessage("📃User Managment"));
    this.getUsers();
  }

  getUsers() {
    //this.userFormArray = [];
    this.api.get('/users').subscribe({
      next: (response) => {
        let data = response.body;
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
    this.api.get('/users').subscribe({
      next: (response) => {
        let data = response.body
        console.log(data);
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
                  password: ['newPassword', Validators.required],
                  role: this.fb.group(backendUser.role as iRole),
                });
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
        for (let existingUser of this.userFormArray) {
          let found = false;
          for (let backendUser of data.payload) {
            if (backendUser.username == existingUser[0].username) {
              found = true;
            }
          }
          if (!found) {
            console.log("delete");
            this.userFormArray.splice(this.userFormArray.indexOf(existingUser), 1);
          }
        }
      },
      error: (err) => {
        this.notifier.showError(err.status, err.error.message);
      }
    });
  }


  onChangeUser(username: string) { //remember to add if the the password
    for (let user of this.userFormArray) {
      if (user[0].username == username) {
        if(user[1].value.password == 'newPassword'){
          delete user[1].value.password;
        } 
        this.api.put('/users/' + username, user[1].value as iUser).subscribe({
          next: (response) => {
            this.notifier.showSuccess(response.status, response.body.message);
          },
          error: (err) => {
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

  



}
