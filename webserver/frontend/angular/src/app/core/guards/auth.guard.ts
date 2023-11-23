import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

export enum eRole {
  Waiter = 'waiter',
  Cashier = 'cashier',
  Production = 'production',
  Admin = 'admin',
  Empty = '',
}

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)!;

  const data = route.data['type'];

  switch(data) { 
    case eRole.Empty: { 
      return auth.isLogged() ? true : false;  
    } 
    case eRole.Waiter: { 
      if (auth.isLogged() && auth.role['waiter'] == true) {
        return true;
      }
      break;
    }
    case eRole.Cashier: {
      if (auth.isLogged() && auth.role['cashier'] == true) {
        return true;
      }
      break;
    }
    case eRole.Production: {
      if (auth.isLogged() && auth.role['production'] == true) {
        return true;
      }
      break;
    }
    case eRole.Admin: {
      if (auth.isLogged() && auth.role['admin'] == true) {
        return true;
      }
      break;
    }
  } 

  return false;

};
