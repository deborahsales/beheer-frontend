import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { FinancialReport } from '../../core/interfaces/financial-report';
import { FinancialReportService } from '../../core/services/financial-report.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { FinancialReportFormComponent } from '../../shared/components/financial-report-form/financial-report-form.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-prestacoes-contas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
    CommonModule,
    CapitalizeFirstPipe,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './prestacoes-contas.component.html',
  styleUrl: './prestacoes-contas.component.scss',
})
export class PrestacoesContasComponent {
  financialReports: FinancialReport[] = [];
  filteredFinancialReports: FinancialReport[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = false;
  role: string = 'colaborador';
  statusFilterControl = new FormControl('');
  statusFilter?: string;

  filterByStatus(status: string) {
    if (!status) {
      this.filteredFinancialReports = [...this.financialReports];
      return;
    }

    const statusLower = status.toLowerCase();

    this.filteredFinancialReports = this.financialReports.filter((data) =>
      data.status.toLowerCase().includes(statusLower)
    );
  }

  reset() {
    this.statusFilterControl.setValue('');
  }

  constructor(
    private financialReportService: FinancialReportService,
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
    }

    this.financialReportService.getFinancialReports().subscribe((data) => {
      this.financialReports = data;
      this.filteredFinancialReports = [...this.financialReports];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredFinancialReports = this.financialReports.filter(
      (financialReport) =>
        financialReport.usuario.nome.toLowerCase().includes(term) ||
        financialReport.status.toLowerCase().includes(term) ||
        financialReport.descricao.toLowerCase().includes(term)
    );
  }

  openFinancialReport(id: number) {
    this.router.navigate([`/${this.role}/prestacao-contas`, id]);
  }

  createReport() {
    this.openDialog
      .open<FinancialReportFormComponent, void, any>(
        FinancialReportFormComponent
      )
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: any) {
    this.isLoading.set(true);

    const formData = new FormData();
    formData.append('descricao', data.descricao);
    formData.append('data', new Date(data.data).toISOString());
    const valorNormalizado = Number(String(data.valor).replace(',', '.'));
    formData.append('valor', valorNormalizado.toString());

    if (data.imagemFile) {
      formData.append('imagem', data.imagemFile, data.imagemFile.name);
    }

    this.financialReportService.createFinancialReport(formData).subscribe({
      next: (newReport) => {
        this.financialReports.push(newReport);
        this.applyFilter();
        this.isLoading.set(false);
        this.snackbarService.show('Prestação de contas criada com sucesso');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(
          err.error.message || 'Erro ao criar prestação de contas'
        );
      },
    });
  }

  manageRequest(financialReportId: number, manage: boolean) {
    this.isLoading.set(true);
    const status = manage ? 'ACEITE' : 'RECUSADA';
    const financialReport = { status };

    this.financialReportService
      .manageFinancialReport(financialReportId, financialReport)
      .subscribe({
        next: () => {
          const financialReport = this.financialReports.find(
            (n) => n.id === financialReportId
          );
          if (financialReport) {
            financialReport.status = status;
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

  deleteFinancialReport(financialReportId: number) {
    const financialReport = this.financialReports.find(
      (financialReport) => financialReport.id === financialReportId
    );
    if (!financialReport) return;

    this.openDialog
      .confirm({
        title: 'Excluir prestação de contas',
        message: `Tem certeza que deseja excluir a prestação de contas?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(financialReportId);
        }
      });
  }

  private executeDelete(financialReportId: number): void {
    this.isLoading.set(true);

    this.financialReportService
      .deleteFinancialReport(financialReportId)
      .subscribe({
        next: () => {
          this.financialReports = this.financialReports.filter(
            (financialReport) => financialReport.id !== financialReportId
          );
          this.applyFilter();
          this.snackbarService.show('Prestação de contas deletada com sucesso');
          this.isLoading.set(false);
        },
        error: (err) => {
          this.snackbarService.show(
            err.error?.message || 'Erro ao deletar prestação de contas'
          );
          this.isLoading.set(false);
        },
      });
  }
}
