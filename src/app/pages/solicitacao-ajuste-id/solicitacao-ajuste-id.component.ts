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
import { AdjustmentRequest } from '../../core/interfaces/adjustment-request';
import { AdjustmentRequestService } from '../../core/services/adjustment-requests.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-solicitacao-ajuste-id',
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
    CapitalizeFirstPipe,
    MatSelectModule,
  ],
  templateUrl: './solicitacao-ajuste-id.component.html',
  styleUrl: './solicitacao-ajuste-id.component.scss',
})
export class SolicitacaoAjusteIdComponent {
  adjustmentRequestId!: number;
  isLoading = signal(false);
  adjustmentRequest!: AdjustmentRequest;
  userId!: number;
  canManage: boolean = false;
  role: string = 'colaborador';
  isEditing = signal(false);
  form: FormGroup;

  Motivos: any[] = [
    { value: 'ERRO', viewValue: 'Erro' },
    { value: 'DUPLICADO', viewValue: 'Duplicado' },
  ];

  constructor(
    private route: ActivatedRoute,
    private adjustmentRequestService: AdjustmentRequestService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService
  ) {
    this.form = this.formBuilder.group({
      motivo: ['', Validators.required],
      dataAjustada: ['', Validators.required],
      horaAjustada: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.adjustmentRequestId = Number(this.route.snapshot.paramMap.get('id')!);

    this.userService.getAuthUser().subscribe((user) => {
      if (user) {
        this.userId = user?.sub || 0;
        this.role = user?.funcao.toLowerCase() || '';
      }
    });

    if (this.adjustmentRequestId) {
      this.adjustmentRequestService
        .getAdjustmentRequestById(this.adjustmentRequestId)
        .subscribe({
          next: (adjustmentRequest) => {
            this.adjustmentRequest = adjustmentRequest;

            if (this.userId === this.adjustmentRequest.usuarioId) {
              this.canManage = true;
            }

            const date = new Date(adjustmentRequest.dateTimestampAjustado);
            const horaString = date.toTimeString().slice(0, 5);

            this.form.patchValue({
              dataAjustada: date,
              horaAjustada: horaString,
              motivo: adjustmentRequest.motivo,
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

      const { dataAjustada, horaAjustada, motivo } = this.form.value;

      const [hours, minutes] = horaAjustada.split(':');
      const combinedDate = new Date(dataAjustada);
      combinedDate.setHours(+hours, +minutes, 0, 0);

      const isoString = combinedDate.toISOString();

      const dadosAtualizados = {
        motivo: motivo,
        dateTimestampAjustado: isoString,
      };

      if (dadosAtualizados) {
        this.adjustmentRequestService
          .updateAdjustmentRequest(this.adjustmentRequest.id, dadosAtualizados)
          .subscribe({
            next: (value) => {
              this.adjustmentRequest = {
                ...this.adjustmentRequest,
                ...dadosAtualizados,
              };
              this.isLoading.set(false);
              this.snackbarService.show('Solicitação editada com sucesso');
              this.isEditing = signal(false);
            },
            error: (err) => {
              this.isLoading.set(false);
              this.snackbarService.show(
                err.error.message || 'Erro ao editar solicitação'
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
