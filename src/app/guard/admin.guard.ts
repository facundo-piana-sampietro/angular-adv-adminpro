import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const _us = inject(UsuarioService)
  const router = inject(Router)
  if (_us.role == 'ADMIN_ROLE'){
    return true
  } else {
    router.navigateByUrl('/dashboard')
    return false
  }
};
