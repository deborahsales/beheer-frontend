import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { AdjustmentRequest } from '../../core/interfaces/adjustment-request';
import { AdjustmentRequestService } from '../../core/services/adjustment-requests.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-solicitacoes-ajuste',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
    CapitalizeFirstPipe,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './solicitacoes-ajuste.component.html',
  styleUrl: './solicitacoes-ajuste.component.scss',
})
export class SolicitacoesAjusteComponent {
  adjustmentRequests: AdjustmentRequest[] = [];
  filteredAdjustmentRequests: AdjustmentRequest[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = false;
  canSearch: boolean = true;
  role: string = 'colaborador';

  statusFilterControl = new FormControl('');
  statusFilter?: string;

  filterByStatus(status: string) {
    if (!status) {
      this.filteredAdjustmentRequests = [...this.adjustmentRequests];
      return;
    }

    const statusLower = status.toLowerCase();

    this.filteredAdjustmentRequests = this.adjustmentRequests.filter((data) =>
      data.status.toLowerCase().includes(statusLower)
    );
  }

  reset() {
    this.statusFilterControl.setValue('');
  }

  constructor(
    private adjustmentRequestService: AdjustmentRequestService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {
    this.statusFilterControl.valueChanges.subscribe((value) => {
      const safeValue = value ?? '';
      this.statusFilter = safeValue;
      this.filterByStatus(safeValue);
    });
  }

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    if (this.role === 'colaborador' || this.role === 'gestor') {
      this.canCreate = true;
      this.canSearch = false;
    }

    this.adjustmentRequestService.getAdjustmentRequests().subscribe((data) => {
      this.adjustmentRequests = data;
      this.filteredAdjustmentRequests = [...this.adjustmentRequests];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredAdjustmentRequests = this.adjustmentRequests.filter(
      (adjustmentRequest) =>
        adjustmentRequest.usuario.nome.toLowerCase().includes(term) ||
        adjustmentRequest.status.toLowerCase().includes(term) ||
        adjustmentRequest.motivo.toLowerCase().includes(term)
    );
  }

  openAdjustmentRequest(id: number) {
    this.router.navigate([`/${this.role}/solicitacao-ajuste`, id]);
  }

  openRequest() {}

  manageRequest(adjustmentRequestId: number, manage: boolean) {
    this.isLoading.set(true);
    const status = manage ? 'AJUSTADO' : 'RECUSADO';
    const adjustmentRequest = { status };

    this.adjustmentRequestService
      .manageAdjustmentRequest(adjustmentRequestId, adjustmentRequest)
      .subscribe({
        next: () => {
          const adjustmentRequest = this.adjustmentRequests.find(
            (n) => n.id === adjustmentRequestId
          );
          if (adjustmentRequest) {
            adjustmentRequest.status = status;
          }
          this.snackbarService.show('Status alterado com sucesso.');
          this.isLoading.set(false);
        },
        error: () => {
          this.snackbarService.show('Erro ao alterar status.');
          this.isLoading.set(false);
        },
      });
  }

  deleteAdjustmentRequest(adjustmentRequestId: number) {
    const adjustmentRequest = this.adjustmentRequests.find(
      (adjustmentRequest) => adjustmentRequest.id === adjustmentRequestId
    );
    if (!adjustmentRequest) return;

    this.openDialog
      .confirm({
        title: 'Excluir solicitação',
        message: `Tem certeza que deseja excluir a solicitação?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(adjustmentRequestId);
        }
      });
  }

  private executeDelete(adjustmentRequestId: number): void {
    this.isLoading.set(true);

    this.adjustmentRequestService
      .deleteAdjustmentRequest(adjustmentRequestId)
      .subscribe({
        next: () => {
          this.adjustmentRequests = this.adjustmentRequests.filter(
            (adjustmentRequest) => adjustmentRequest.id !== adjustmentRequestId
          );
          this.applyFilter();
          this.snackbarService.show('Solicitação deletada com sucesso');
          this.isLoading.set(false);
        },
        error: (err) => {
          this.snackbarService.show(
            err.error?.message || 'Erro ao deletar solicitação'
          );
          this.isLoading.set(false);
        },
      });
  }
}
