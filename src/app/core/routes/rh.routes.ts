import { Routes } from '@angular/router';
import { AtestadoIdComponent } from '../../pages/atestado-id/atestado-id.component';
import { AtestadosComponent } from '../../pages/atestados/atestados.component';
import { AvisoIdComponent } from '../../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../../pages/avisos/avisos.component';
import { PontoIdComponent } from '../../pages/ponto-id/ponto-id.component';
import { PontosComponent } from '../../pages/pontos/pontos.component';
import { PrestacaoContasIdComponent } from '../../pages/prestacao-contas-id/prestacao-contas-id.component';
import { PrestacoesContasComponent } from '../../pages/prestacoes-contas/prestacoes-contas.component';
import { SolicitacaoAjusteIdComponent } from '../../pages/solicitacao-ajuste-id/solicitacao-ajuste-id.component';
import { SolicitacoesAjusteComponent } from '../../pages/solicitacoes-ajuste/solicitacoes-ajuste.component';
import { rhGuard } from '../guards/rh.guard';

export const rhRoutes: Routes = [
  {
    path: '',
    canActivateChild: [rhGuard],
    data: {
      sidebarLinks: [
        {
          label: 'Avisos',
          route: '/rh/avisos',
          icon: 'forward_to_inbox',
        },
        {
          label: 'Pontos',
          route: '/rh/pontos',
          icon: 'add_location_alt',
        },
        {
          label: 'Solicitações de ajuste',
          route: '/rh/solicitacoes-ajuste',
          icon: 'approval',
        },
        {
          label: 'Atestados',
          route: '/rh/atestados',
          icon: 'cardiology',
        },
        {
          label: 'Prestações de contas',
          route: '/rh/prestacoes-contas',
          icon: 'receipt_long',
        },
      ],
    },
    loadComponent: () =>
      import('../../layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'avisos', pathMatch: 'full' },
      { path: 'avisos', component: AvisosComponent },
      { path: 'aviso/:id', component: AvisoIdComponent },
      { path: 'pontos', component: PontosComponent },
      { path: 'ponto/:id', component: PontoIdComponent },
      { path: 'prestacoes-contas', component: PrestacoesContasComponent },
      { path: 'prestacao-contas/:id', component: PrestacaoContasIdComponent },
      { path: 'atestados', component: AtestadosComponent },
      { path: 'atestado/:id', component: AtestadoIdComponent },
      { path: 'solicitacoes-ajuste', component: SolicitacoesAjusteComponent },
      {
        path: 'solicitacao-ajuste/:id',
        component: SolicitacaoAjusteIdComponent,
      },
    ],
  },
];
