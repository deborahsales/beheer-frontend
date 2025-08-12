import { Routes } from '@angular/router';
import { AtestadoIdComponent } from '../../pages/atestado-id/atestado-id.component';
import { AtestadosComponent } from '../../pages/atestados/atestados.component';
import { AvisoIdComponent } from '../../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../../pages/avisos/avisos.component';
import { DemandaIdComponent } from '../../pages/demanda-id/demanda-id.component';
import { DemandasComponent } from '../../pages/demandas/demandas.component';
import { GrupoIdComponent } from '../../pages/grupo-id/grupo-id.component';
import { GruposComponent } from '../../pages/grupos/grupos.component';
import { PontoIdComponent } from '../../pages/ponto-id/ponto-id.component';
import { PontosComponent } from '../../pages/pontos/pontos.component';
import { PrestacaoContasIdComponent } from '../../pages/prestacao-contas-id/prestacao-contas-id.component';
import { PrestacoesContasComponent } from '../../pages/prestacoes-contas/prestacoes-contas.component';
import { SolicitacaoAjusteIdComponent } from '../../pages/solicitacao-ajuste-id/solicitacao-ajuste-id.component';
import { SolicitacoesAjusteComponent } from '../../pages/solicitacoes-ajuste/solicitacoes-ajuste.component';
import { colaboradorGuard } from '../guards/colaborador.guard';

export const colaboradorRoutes: Routes = [
  {
    path: '',
    canActivateChild: [colaboradorGuard],
    data: {
      sidebarLinks: [
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
        {
          label: 'Pontos',
          route: '/colaborador/pontos',
          icon: 'add_location_alt',
        },
        {
          label: 'Solicitações de ajuste',
          route: '/colaborador/solicitacoes-ajuste',
          icon: 'approval',
        },
        {
          label: 'Atestados',
          route: '/colaborador/atestados',
          icon: 'cardiology',
        },
        {
          label: 'Prestações de contas',
          route: '/colaborador/prestacoes-contas',
          icon: 'receipt_long',
        },
      ],
    },
    loadComponent: () =>
      import('../../layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'grupos', pathMatch: 'full' },
      { path: 'grupos', component: GruposComponent },
      { path: 'grupo/:id', component: GrupoIdComponent },
      { path: 'demandas', component: DemandasComponent },
      { path: 'demanda/:id', component: DemandaIdComponent },
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
