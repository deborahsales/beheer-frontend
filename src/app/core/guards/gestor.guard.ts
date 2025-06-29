import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const gestorGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getAuthUser().pipe(
    map((user) => {
      if (user?.funcao === 'GESTOR') {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
