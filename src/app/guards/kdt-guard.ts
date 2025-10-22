import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export const kdtGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  // Revisa el rol guardado
  const { value: role } = await Preferences.get({ key: 'userRole' });
  const userRole = role ? role.toLowerCase() : null;

  if (userRole === 'kdt') {
    return true; // Si el rol es 'kdt', permite el acceso
  } else {
    // Si no es 'kdt', redirige al home de usuario normal (o al login si prefieres)
    router.navigate(['/home']);
    return false;
  }
};