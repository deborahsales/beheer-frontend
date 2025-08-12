import { Routes } from '@angular/router';
import { AtestadoIdComponent } from '../../pages/atestado-id/atestado-id.component';
import { AtestadosComponent } from '../../pages/atestados/atestados.component';
import { AvisoIdComponent } from '../../pages/aviso-id/aviso-id.component';
import { AvisosComponent } from '../../pages/avisos/avisos.component';
import { DemandaIdComponent } from '../../pages/demanda-id/demanda-id.component';
import { DemandasComponent } from '../../pages/demandas/demandas.component';
import { CronogramaIdComponent } from '../../pages/gestor/cronograma-id/cronograma-id.component';
import { CronogramasComponent } from '../../pages/gestor/cronogramas/cronogramas.component';
import { GrupoIdComponent } from '../../pages/grupo-id/grupo-id.component';
import { GruposComponent } from '../../pages/grupos/grupos.component';
import { PontoIdComponent } from '../../pages/ponto-id/ponto-id.component';
import { PontosComponent } from '../../pages/pontos/pontos.component';
import { PrestacaoContasIdComponent } from '../../pages/prestacao-contas-id/prestacao-contas-id.component';
import { PrestacoesContasComponent } from '../../pages/prestacoes-contas/prestacoes-contas.component';
import { SolicitacaoAjusteIdComponent } from '../../pages/solicitacao-ajuste-id/solicitacao-ajuste-id.component';
import { SolicitacoesAjusteComponent } from '../../pages/solicitacoes-ajuste/solicitacoes-ajuste.component';
import { UsuarioIdComponent } from '../../pages/usuario-id/usuario-id.component';
import { gestorGuard } from '../guards/gestor.guard';

export const gestorRoutes: Routes = [
  {
    path: '',
    canActivateChild: [gestorGuard],
    data: {
      sidebarLinks: [
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
        {
          label: 'Pontos',
          route: '/gestor/pontos',
          icon: 'add_location_alt',
        },
        {
          label: 'Solicitações de ajuste',
          route: '/gestor/solicitacoes-ajuste',
          icon: 'approval',
        },
        {
          label: 'Atestados',
          route: '/gestor/atestados',
          icon: 'cardiology',
        },
        {
          label: 'Prestações de contas',
          route: '/gestor/prestacoes-contas',
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
      { path: 'usuario/:id', component: UsuarioIdComponent },
      { path: 'cronogramas', component: CronogramasComponent },
      { path: 'cronograma/:id', component: CronogramaIdComponent },
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
