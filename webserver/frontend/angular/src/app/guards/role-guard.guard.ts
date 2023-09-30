import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const canAccessGUI: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)!;
  const router = inject(Router)!;

  return true;

  if (!auth.has_token) return false;

  const role = auth.role;
  const requiredRole = route.data['role'] as string;

  let canAccess = true;

  if (requiredRole === 'waiter') {
    canAccess = role.waiterGUI;
  }

  if (requiredRole === 'prod') {
    canAccess = role.productionGUI;
  }

  if (requiredRole === 'admin') {
    canAccess = role.adminGUI;
  }

  if (requiredRole === 'cashier') {
    canAccess = role.cashierGUI;
  }

  if (requiredRole === 'analytics') {
    canAccess = role.analyticsGUI;
  }

  if (!canAccess) {
    console.error('Access denied');
    router.navigate(['/']);
  }

  return canAccess;
};
