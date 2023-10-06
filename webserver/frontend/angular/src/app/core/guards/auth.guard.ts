import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)!;

  const data = route.data['type'];

  switch(data) { 
    case '': { 
      return auth.isLogged() ? true : false;  
    } 
    case 'waiter': { 
      if (auth.isLogged() && auth.role['waiterGUI'] == true) {
        return true;
      }
      break;
    }
    case 'cashier': {
      if (auth.isLogged() && auth.role['cashierGUI'] == true) {
        return true;
      }
      break;
    }
    case 'production': {
      if (auth.isLogged() && auth.role['productionGUI'] == true) {
        return true;
      }
      break;
    }
    case 'admin': {
      if (auth.isLogged() && auth.role['adminGUI'] == true) {
        return true;
      }
      break;
    }
  } 

  return false;

};
