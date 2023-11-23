import { Component } from '@angular/core';
import { iDynamicForm } from 'src/app/core/models/dynamic_form.model';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  modelInput: iDynamicForm = {
    route: '/rooms',
    formName: 'newRoom',
    textFields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        value: '',
      },
    ],
  };
    
  constructor(private pageInfo: PageInfoService) {
    Promise.resolve(null).then(() => this.pageInfo.pageMessage = "🚪Rooms");
  }
}
