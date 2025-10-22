import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  // Revisa si existe el token de autenticación
  const { value: token } = await Preferences.get({ key: 'authToken' });

  if (token) {
    return true; // Si hay token, permite el acceso
  } else {
    // Si no hay token, redirige a la página de login
    router.navigate(['/login']);
    return false;
  }
};