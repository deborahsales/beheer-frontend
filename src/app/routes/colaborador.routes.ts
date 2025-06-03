import { Routes } from '@angular/router';
import { colaboradorGuard } from '../core/guards/colaborador.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { ColaboradorDashboardComponent } from '../pages/colaborador/dashboard/dashboard.component';

export const colaboradorRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [colaboradorGuard],
    data: {
      sidebarLinks: [
        {
          label: 'Dashboard',
          route: '/colaborador/dashboard',
          icon: 'dashboard',
        },
      ],
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ColaboradorDashboardComponent },
    ],
  },
];
