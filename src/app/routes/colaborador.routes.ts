import { Routes } from '@angular/router';
import { colaboradorGuard } from '../core/guards/colaborador.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { AvisoIdComponent } from '../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../pages/avisos/avisos.component';
import { ColaboradorDashboardComponent } from '../pages/colaborador/dashboard/dashboard.component';
import { DemandaIdComponent } from '../pages/demanda-id/demanda-id.component';
import { DemandasComponent } from '../pages/demandas/demandas.component';
import { GrupoIdComponent } from '../pages/grupo-id/grupo-id.component';
import { GruposComponent } from '../pages/grupos/grupos.component';

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
        {
          label: 'Grupos',
          route: '/colaborador/grupos',
          icon: 'groups',
        },
        {
          label: 'Demandas',
          route: '/colaborador/demandas',
          icon: 'task',
        },
        {
          label: 'Avisos',
          route: '/colaborador/avisos',
          icon: 'notifications',
        },
      ],
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ColaboradorDashboardComponent },
      { path: 'grupos', component: GruposComponent },
      { path: 'grupo/:id', component: GrupoIdComponent },
      { path: 'demandas', component: DemandasComponent },
      { path: 'demanda/:id', component: DemandaIdComponent },
      { path: 'avisos', component: AvisosComponent },
      { path: 'aviso/:id', component: AvisoIdComponent },
    ],
  },
];
