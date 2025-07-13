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

@Component({
  selector: 'app-prestacoes-contas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
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

    this.financialReportService.getFinancialReports().subscribe((data) => {
      this.financialReports = data;
      this.filteredFinancialReports = [...this.financialReports];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredFinancialReports = this.financialReports.filter(
      (financialReport) => financialReport.status.toLowerCase().includes(term)
    );
  }

  openFinancialReport(id: number) {
    this.router.navigate([`/${this.role}/prestacao-contas`, id]);
  }

  createReport() {}
}
