import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {

  const _us = inject(UsuarioService);
  const router = inject(Router);

  return _us.validarToken()
  .pipe(
    tap( estaAutenticado => {
      if (!estaAutenticado){
        router.navigateByUrl('/login')
      }
    })
  );

};
