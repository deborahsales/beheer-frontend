import { Routes } from '@angular/router';
import { EditarUsuarioComponent } from '../../pages/admin/editar-usuario/editar-usuario.component';
import { NovoUsuarioComponent } from '../../pages/admin/novo-usuario/novo-usuario.component';
import { UsuariosComponent } from '../../pages/admin/usuarios/usuarios.component';
import { AvisoIdComponent } from '../../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../../pages/avisos/avisos.component';
import { UsuarioIdComponent } from '../../pages/usuario-id/usuario-id.component';
import { adminGuard } from '../guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivateChild: [adminGuard],
    data: {
      sidebarLinks: [
        { label: 'Usuários', route: '/administrador/usuarios', icon: 'group' },
        {
          label: 'Avisos',
          route: '/administrador/avisos',
          icon: 'forward_to_inbox',
        },
      ],
    },
    loadComponent: () =>
      import('../../layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'avisos', component: AvisosComponent },
      { path: 'aviso/:id', component: AvisoIdComponent },
      { path: 'novo-usuario', component: NovoUsuarioComponent },
      { path: 'usuarios/:id/editar', component: EditarUsuarioComponent },
      { path: 'usuario/:id', component: UsuarioIdComponent },
    ],
  },
];
