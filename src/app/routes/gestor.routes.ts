import { Routes } from '@angular/router';
import { gestorGuard } from '../core/guards/gestor.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { GestorDashboardComponent } from '../pages/gestor/dashboard/dashboard.component';

export const gestorRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [gestorGuard],
    data: {
      sidebarLinks: [
        {
          label: 'Dashboard',
          route: '/gestor/dashboard',
          icon: 'dashboard',
        },
      ],
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: GestorDashboardComponent },
    ],
  },
];
