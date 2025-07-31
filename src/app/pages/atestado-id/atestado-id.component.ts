import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MedicalCertificate } from '../../core/interfaces/medical-certificate';
import { MedicalCertificateService } from '../../core/services/medical-certificate.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { AppDateAdapter } from '../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../core/utils/date-format';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { PdfModalComponent } from '../../shared/components/pdf-modal/pdf-modal.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';
import { OpenDialogService } from '../../core/services/open-dialog.service';

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
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
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
    private snackbarService: SnackbarService,
    private openDialog: OpenDialogService
  ) {
    this.form = this.formBuilder.group({
      dataAtestado: ['', Validators.required],
      horaInicio: [''],
      horaTermino: [''],
      diaInteiro: ['', Validators.required],
    });

    this.form.get('diaInteiro')?.valueChanges.subscribe((value) => {
      const horaInicio = this.form.get('horaInicio');
      const horaTermino = this.form.get('horaTermino');

      if (value === 'SIM') {
        horaInicio?.disable();
        horaTermino?.disable();
      } else {
        horaInicio?.enable();
        horaTermino?.enable();
      }

      horaInicio?.updateValueAndValidity();
      horaTermino?.updateValueAndValidity();
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

  isImage(url: string): boolean {
    return /\.(jpeg|jpg|png|gif)$/i.test(url);
  }

  abrirModalPdf() {
    const url = this.medicalCertificate?.imagem;
    console.log('Tipo da URL:', typeof url, url);

    if (url) {
      this.openDialog.open(PdfModalComponent, {
        pdfUrl: url,
      });
    } else {
      console.warn('URL do PDF está indefinida.');
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

      let dadosAtualizados: any = {
        dataAtestado,
        diaInteiro,
      };

      if (diaInteiro === 'SIM') {
        dadosAtualizados.horaInicio = null;
        dadosAtualizados.horaTermino = null;
      } else {
        if (horaInicio) {
          const [sHours, sMinutes] = horaInicio.split(':');
          const combinedDatehoraInicio = new Date(dataAtestado);
          combinedDatehoraInicio.setHours(+sHours, +sMinutes, 0, 0);
          dadosAtualizados.horaInicio = combinedDatehoraInicio.toISOString();
        }

        if (horaTermino) {
          const [eHours, eMinutes] = horaTermino.split(':');
          const combinedDatehoraTermino = new Date(dataAtestado);
          combinedDatehoraTermino.setHours(+eHours, +eMinutes, 0, 0);
          dadosAtualizados.horaTermino = combinedDatehoraTermino.toISOString();
        }
      }

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

  manageRequest(manage: boolean) {
    this.isLoading.set(true);
    const status = manage ? 'ACEITE' : 'RECUSADO';
    const medicalCertificate = { status };

    this.medicalCertificateService
      .manageMedicalCertificate(this.medicalCertificateId, medicalCertificate)
      .subscribe({
        next: () => {
          this.snackbarService.show('Status alterado com sucesso.');
          this.medicalCertificate.status = status;
          this.isLoading.set(false);
        },
        error: () => {
          this.snackbarService.show('Erro ao alterar status.');
          this.isLoading.set(false);
        },
      });
  }
}
