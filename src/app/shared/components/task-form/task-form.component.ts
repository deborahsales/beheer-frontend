import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ItemSelectionComponent } from '../item-selection/item-selection.component';
import { NotificationFormComponent } from '../notification-form/notification-form.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { AppDateAdapter } from '../../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../../core/utils/date-format';

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

  Prioridades: Prioridade[] = [
    { value: 'ALTA', viewValue: 'Alta' },
    { value: 'MEDIA', viewValue: 'Média' },
    { value: 'BAIXA', viewValue: 'Baixa' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NotificationFormComponent>
  ) {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      prazo: ['', Validators.required],
      prioridade: ['', Validators.required],
    });
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
