import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from '../pages/admin/dashboard/dashboard.component';
import { GerenciaAvisosComponent } from '../pages/gerencia-avisos/gerencia-avisos.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [adminGuard],
    data: {
      sidebarLinks: [
        { label: 'Usuários', route: '/admin/usuarios', icon: 'group' },
        { label: 'Avisos', route: '/admin/avisos', icon: 'forward_to_inbox' },
      ],
    },
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      { path: 'usuarios', component: AdminDashboardComponent },
      { path: 'avisos', component: GerenciaAvisosComponent },
    ],
  },
];
