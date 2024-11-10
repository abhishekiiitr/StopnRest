import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inject AuthService
  const router = inject(Router);            // Inject Router

  // Check if the user is authenticated
  if (authService.isAuthenticated()) { 
    return true;  // Allow access if authenticated
  } else {
    router.navigate(['/auth/login']);  // Redirect to login page if not authenticated
    return false;  // Block access
  }
};
