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
      if (auth.isLogged() && auth.role['waiter'] == true) {
        return true;
      }
      break;
    }
    case 'cashier': {
      if (auth.isLogged() && auth.role['cashier'] == true) {
        return true;
      }
      break;
    }
    case 'production': {
      if (auth.isLogged() && auth.role['production'] == true) {
        return true;
      }
      break;
    }
    case 'admin': {
      if (auth.isLogged() && auth.role['admin'] == true) {
        return true;
      }
      break;
    }
  } 

  return false;

};
