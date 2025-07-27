import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { TasksKanbanComponent } from './shared/components/tasks-kanban/tasks-kanban.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'kanban', component: TasksKanbanComponent },
    ],
  },
  {
    path: 'administrador',
    loadChildren: () =>
      import('./routes/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'gestor',
    loadChildren: () =>
      import('./routes/gestor.routes').then((m) => m.gestorRoutes),
  },
  {
    path: 'colaborador',
    loadChildren: () =>
      import('./routes/colaborador.routes').then((m) => m.colaboradorRoutes),
  },
  {
    path: 'rh',
    loadChildren: () => import('./routes/rh.routes').then((m) => m.rhRoutes),
  },
];
