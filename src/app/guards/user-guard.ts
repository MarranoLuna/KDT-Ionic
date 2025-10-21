import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export const userGuard: CanActivateFn = async (route, state) => { // <-- Asegúrate de que se llame userGuard
  const router = inject(Router);

  const { value: role } = await Preferences.get({ key: 'userRole' });
  const userRole = role ? role.toLowerCase() : null;

  if (userRole === 'user' || userRole === null) {
    return true;
  } else {
    router.navigate(['/kdt-home']);
    return false;
  }
};