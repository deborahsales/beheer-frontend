import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialReport } from '../../core/interfaces/financial-report';
import { FinancialReportService } from '../../core/services/financial-report.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
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

  constructor(
    private financialReportService: FinancialReportService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {}

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
        financialReport.status.toLowerCase().includes(term)
    );
  }

  openFinancialReport(id: number) {
    this.router.navigate([`/${this.role}/prestacao-contas`, id]);
  }

  createReport() {}

  accept(financialReportId: number) {}

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
