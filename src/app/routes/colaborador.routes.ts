import { Routes } from '@angular/router';
import { colaboradorGuard } from '../core/guards/colaborador.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { ColaboradorDashboardComponent } from '../pages/colaborador/dashboard/dashboard.component';

export const colaboradorRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [colaboradorGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: ColaboradorDashboardComponent },
    ],
  },
];
