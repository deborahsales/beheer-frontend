import { Routes } from '@angular/router';
import { rhGuard } from '../core/guards/rh.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { AvisoIdComponent } from '../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../pages/avisos/avisos.component';
import { RhDashboardComponent } from '../pages/rh/dashboard/dashboard.component';

export const rhRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [rhGuard],
    data: {
      sidebarLinks: [
        {
          label: 'Dashboard',
          route: '/rh/dashboard',
          icon: 'dashboard',
        },
      ],
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: RhDashboardComponent },
      { path: 'avisos', component: AvisosComponent },
      { path: 'aviso/:id', component: AvisoIdComponent },
    ],
  },
];
