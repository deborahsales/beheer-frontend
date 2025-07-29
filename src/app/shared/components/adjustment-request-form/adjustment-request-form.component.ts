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
import { GroupFormComponent } from '../group-form/group-form.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { AppDateAdapter } from '../../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../../core/utils/date-format';

@Component({
  selector: 'app-adjustment-request-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './adjustment-request-form.component.html',
  styleUrl: './adjustment-request-form.component.scss',
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})
export class AdjustmentRequestFormComponent {
  form: FormGroup;

  Motivos: any[] = [
    { value: 'ERRO', viewValue: 'Erro' },
    { value: 'DUPLICADO', viewValue: 'Duplicado' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GroupFormComponent>
  ) {
    this.form = this.formBuilder.group({
      motivo: ['', Validators.required],
      dataAjustada: ['', Validators.required],
      horaAjustada: ['', Validators.required],
    });

    this.form.get('motivo')?.valueChanges.subscribe((value) => {
      const dataAjustada = this.form.get('dataAjustada');
      const horaAjustada = this.form.get('horaAjustada');

      if (value === 'DUPLICADO') {
        dataAjustada?.disable();
        horaAjustada?.disable();
      } else {
        dataAjustada?.enable();
        horaAjustada?.enable();
      }

      dataAjustada?.updateValueAndValidity();
      horaAjustada?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
      });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
