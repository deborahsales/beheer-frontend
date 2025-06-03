import { Routes } from '@angular/router';
import { rhGuard } from '../core/guards/rh.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { RhDashboardComponent } from '../pages/rh/dashboard/dashboard.component';

export const rhRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [rhGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: RhDashboardComponent },
    ],
  },
];
