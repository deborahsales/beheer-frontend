import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from '../pages/admin/dashboard/dashboard.component';
import { EditarUsuarioComponent } from '../pages/admin/editar-usuario/editar-usuario.component';
import { NovoUsuarioComponent } from '../pages/admin/novo-usuario/novo-usuario.component';
import { AvisoIdComponent } from '../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../pages/avisos/avisos.component';
import { UsuarioIdComponent } from '../pages/usuario-id/usuario-id.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
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
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: AdminDashboardComponent },
      { path: 'avisos', component: AvisosComponent },
      { path: 'aviso/:id', component: AvisoIdComponent },
      { path: 'novo-usuario', component: NovoUsuarioComponent },
      { path: 'usuarios/:id/editar', component: EditarUsuarioComponent },
      { path: 'usuario/:id', component: UsuarioIdComponent },
    ],
  },
];
