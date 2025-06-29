import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { adminRoutes } from './routes/admin.routes';
import { colaboradorRoutes } from './routes/colaborador.routes';
import { gestorRoutes } from './routes/gestor.routes';
import { rhRoutes } from './routes/rh.routes';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: 'administrador',
    children: adminRoutes,
  },
  {
    path: 'gestor',
    children: gestorRoutes,
  },
  {
    path: 'colaborador',
    children: colaboradorRoutes,
  },
  {
    path: 'rh',
    children: rhRoutes,
  },
];
