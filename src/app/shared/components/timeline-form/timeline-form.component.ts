import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  selector: 'app-timeline-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatDatepickerModule,
  ],
  templateUrl: './timeline-form.component.html',
  styleUrl: './timeline-form.component.scss',
})
export class TimelineFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GroupFormComponent>
  ) {
    this.form = this.formBuilder.group(
      {
        titulo: ['', Validators.required],
        descricao: ['', Validators.required],
        dataInicio: ['', Validators.required],
        dataTermino: ['', Validators.required],
      },
      {
        validators: [this.dataRangeValidator],
      }
    );
  }

  ngOnInit() {
    this.form.get('dataInicio')?.valueChanges.subscribe(() => {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    });

    this.form.get('dataTermino')?.valueChanges.subscribe(() => {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    });
  }

  dataRangeValidator(group: AbstractControl): ValidationErrors | null {
    const dataInicioControl = group.get('dataInicio');
    const dataTerminoControl = group.get('dataTermino');

    const dataInicio = dataInicioControl?.value;
    const dataTermino = dataTerminoControl?.value;

    if (!dataInicio || !dataTermino) {
      return null;
    }

    const inicio = new Date(dataInicio);
    const termino = new Date(dataTermino);

    if (inicio > termino) {
      const currentErrors = dataTerminoControl?.errors || {};
      dataTerminoControl?.setErrors({
        ...currentErrors,
        dataRangeInvalid: true,
      });
      return { dataRangeInvalid: true };
    } else {
      const errors = dataTerminoControl?.errors;
      if (errors) {
        delete errors['dataRangeInvalid'];
        if (Object.keys(errors).length === 0) {
          dataTerminoControl.setErrors(null);
        } else {
          dataTerminoControl.setErrors(errors);
        }
      }
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
