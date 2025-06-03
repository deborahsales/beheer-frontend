import { Routes } from '@angular/router';
import { adminGuard } from '../core/guards/admin.guard';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from '../pages/admin/dashboard/dashboard.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivateChild: [adminGuard],
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '', component: AdminDashboardComponent },
    ],
  },
];
