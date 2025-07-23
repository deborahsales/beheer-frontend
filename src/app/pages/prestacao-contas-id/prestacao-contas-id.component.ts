import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { FinancialReport } from '../../core/interfaces/financial-report';
import { FinancialReportService } from '../../core/services/financial-report.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-prestacao-contas-id',
  imports: [
    ProgressSpinnerComponent,
    ContainerComponent,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    CapitalizeFirstPipe,
  ],
  templateUrl: './prestacao-contas-id.component.html',
  styleUrl: './prestacao-contas-id.component.scss',
})
export class PrestacaoContasIdComponent {
  financialReportId!: number;
  isLoading = signal(false);
  financialReport!: FinancialReport;
  userId!: number;
  canManage: boolean = false;
  role: string = 'colaborador';
  isEditing = signal(false);
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private financialReportService: FinancialReportService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService
  ) {
    this.form = this.formBuilder.group({
      data: ['', Validators.required],
      valor: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.financialReportId = Number(this.route.snapshot.paramMap.get('id')!);

    this.userService.getAuthUser().subscribe((user) => {
      if (user) {
        this.userId = user?.sub || 0;
        this.role = user?.funcao.toLowerCase() || '';
      }
    });

    if (this.financialReportId) {
      this.financialReportService
        .getFinancialReportById(this.financialReportId)
        .subscribe({
          next: (financialReport) => {
            this.financialReport = financialReport;

            if (this.userId === this.financialReport.usuarioId) {
              this.canManage = true;
            }

            this.form.patchValue({
              data: financialReport.data,
              valor: Number(financialReport.valor).toFixed(2),
              descricao: financialReport.descricao,
            });

            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }
  }

  edit() {
    this.isEditing = signal(true);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      const { data, valor, descricao } = this.form.value;

      const dadosAtualizados = {
        data,
        valor,
        descricao,
      };

      if (dadosAtualizados) {
        this.financialReportService
          .updateFinancialReport(this.financialReport.id, dadosAtualizados)
          .subscribe({
            next: (value) => {
              this.financialReport = {
                ...this.financialReport,
                ...dadosAtualizados,
              };
              this.isLoading.set(false);
              this.snackbarService.show(
                'Prestação de contas editada com sucesso'
              );
              this.isEditing = signal(false);
            },
            error: (err) => {
              this.isLoading.set(false);
              this.snackbarService.show(
                err.error.message || 'Erro ao editar prestação de contas'
              );
            },
          });
      }
    }
  }

  onCancel() {
    this.isEditing = signal(false);
  }

  manageRequest(manage: boolean) {}
}
