import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppDateAdapter } from '../../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../../core/utils/date-format';
import { ItemSelectionComponent } from '../item-selection/item-selection.component';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

interface Prioridade {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
    ItemSelectionComponent,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})
export class TaskFormComponent {
  form: FormGroup;
  step: number = 1;
  selectedUserIds: number[] = [];
  dataInicioCronograma!: string;
  dataTerminoCronograma!: string;

  Prioridades: Prioridade[] = [
    { value: 'ALTA', viewValue: 'Alta' },
    { value: 'MEDIA', viewValue: 'Média' },
    { value: 'BAIXA', viewValue: 'Baixa' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      dataInicio: string;
      dataTermino: string;
    } | null = null,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NotificationFormComponent>
  ) {
    if (data) {
      this.dataInicioCronograma = data.dataInicio;
      this.dataTerminoCronograma = data.dataTermino;
    }

    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      prazo: [
        '',
        [
          Validators.required,
          this.prazoDentroDoRangeValidator(
            this.dataInicioCronograma,
            this.dataTerminoCronograma
          ),
        ],
      ],
      prioridade: ['', Validators.required],
    });
  }

  prazoDentroDoRangeValidator(dataInicio: string, dataFim: string) {
    return (control: any) => {
      const value = control.value;

      if (!value) return null;

      const prazo = new Date(value);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);

      if (prazo < inicio || prazo > fim) {
        return { prazoForaDoIntervalo: true };
      }

      return null;
    };
  }

  onSubmit(selectedGroupIds: number[]) {
    if (this.form.valid) {
      const dadosComUsuarios = {
        ...this.form.value,
        usuariosDemanda: this.selectedUserIds,
        gruposDemanda: selectedGroupIds,
      };
      this.dialogRef.close(dadosComUsuarios);
    }
  }

  nextStep(idsSelecionados: number[]) {
    if (idsSelecionados.length > 0) {
      this.selectedUserIds = idsSelecionados;
    }

    if (this.form.valid) {
      this.step += 1;
    }
  }

  previousStep() {
    this.step -= 1;
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
