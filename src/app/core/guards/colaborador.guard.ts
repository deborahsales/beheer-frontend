import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../services/user.service';

export const colaboradorGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.retornarUser().pipe(
    map((user) => {
      if (user?.funcao === 'COLABORADOR') {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
