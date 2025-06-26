import { Routes } from '@angular/router';
import { gestorGuard } from '../core/guards/gestor.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { AvisosComponent } from '../pages/avisos/avisos.component';
import { DemandasComponent } from '../pages/demandas/demandas.component';
import { CronogramasComponent } from '../pages/gestor/cronogramas/cronogramas.component';
import { GestorDashboardComponent } from '../pages/gestor/dashboard/dashboard.component';
import { GruposComponent } from '../pages/grupos/grupos.component';

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
        {
          label: 'Grupos',
          route: '/gestor/grupos',
          icon: 'groups',
        },
        {
          label: 'Demandas',
          route: '/gestor/demandas',
          icon: 'task',
        },
        {
          label: 'Avisos',
          route: '/gestor/avisos',
          icon: 'notifications',
        },
        {
          label: 'Cronogramas',
          route: '/gestor/cronogramas',
          icon: 'timeline',
        },
      ],
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: GestorDashboardComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'demandas', component: DemandasComponent },
      { path: 'avisos', component: AvisosComponent },
      { path: 'cronogramas', component: CronogramasComponent },
    ],
  },
];
