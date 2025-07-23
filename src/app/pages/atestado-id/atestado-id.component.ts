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
import { MedicalCertificate } from '../../core/interfaces/medical-certificate';
import { MedicalCertificateService } from '../../core/services/medical-certificate.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-atestado-id',
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
  templateUrl: './atestado-id.component.html',
  styleUrl: './atestado-id.component.scss',
})
export class AtestadoIdComponent {
  medicalCertificateId!: number;
  isLoading = signal(false);
  medicalCertificate!: MedicalCertificate;
  userId!: number;
  canManage: boolean = false;
  role: string = 'colaborador';
  isEditing = signal(false);
  form: FormGroup;

  DiaInteiro: any[] = [
    { value: 'SIM', viewValue: 'Sim' },
    { value: 'NAO', viewValue: 'Não' },
  ];

  constructor(
    private route: ActivatedRoute,
    private medicalCertificateService: MedicalCertificateService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService
  ) {
    this.form = this.formBuilder.group({
      dataAtestado: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaTermino: ['', Validators.required],
      diaInteiro: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.medicalCertificateId = Number(this.route.snapshot.paramMap.get('id')!);

    this.userService.getAuthUser().subscribe((user) => {
      if (user) {
        this.userId = user?.sub || 0;
        this.role = user?.funcao.toLowerCase() || '';
      }
    });

    if (this.medicalCertificateId) {
      this.medicalCertificateService
        .getMedicalCertificateById(this.medicalCertificateId)
        .subscribe({
          next: (medicalCertificate) => {
            this.medicalCertificate = medicalCertificate;

            if (this.userId === this.medicalCertificate.usuarioId) {
              this.canManage = true;
            }

            const horaInicio = new Date(medicalCertificate.horaInicio);
            const horaInicioString = horaInicio.toTimeString().slice(0, 5);

            const horaTermino = new Date(medicalCertificate.horaTermino);
            const horaTerminoString = horaTermino.toTimeString().slice(0, 5);

            this.form.patchValue({
              dataAtestado: medicalCertificate.dataAtestado,
              horaInicio: horaInicioString,
              horaTermino: horaTerminoString,
              diaInteiro: medicalCertificate.diaInteiro,
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

      const { dataAtestado, horaInicio, horaTermino, diaInteiro } =
        this.form.value;

      const [sHours, sMinutes] = horaInicio.split(':');
      const combinedDatehoraInicio = new Date(dataAtestado);
      combinedDatehoraInicio.setHours(+sHours, +sMinutes, 0, 0);
      const isoStringhoraInicio = combinedDatehoraInicio.toISOString();

      const [eHours, eMinutes] = horaTermino.split(':');
      const combinedDatehoraTermino = new Date(dataAtestado);
      combinedDatehoraTermino.setHours(+eHours, +eMinutes, 0, 0);
      const isoStringhoraTermino = combinedDatehoraTermino.toISOString();

      const dadosAtualizados = {
        dataAtestado: dataAtestado,
        horaInicio: isoStringhoraInicio,
        horaTermino: isoStringhoraTermino,
        diaInteiro: diaInteiro,
      };

      if (dadosAtualizados) {
        this.medicalCertificateService
          .updateMedicalCertificate(
            this.medicalCertificate.id,
            dadosAtualizados
          )
          .subscribe({
            next: (value) => {
              this.medicalCertificate = {
                ...this.medicalCertificate,
                ...dadosAtualizados,
              };
              this.isLoading.set(false);
              this.snackbarService.show('Atestado editado com sucesso');
              this.isEditing = signal(false);
            },
            error: (err) => {
              this.isLoading.set(false);
              this.snackbarService.show(
                err.error.message || 'Erro ao editar atestado'
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
