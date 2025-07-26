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

@Component({
  selector: 'app-medical-certificate-form',
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
  templateUrl: './medical-certificate-form.component.html',
  styleUrl: './medical-certificate-form.component.scss',
})
export class MedicalCertificateFormComponent {
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  DiaInteiro: any[] = [
    { value: 'SIM', viewValue: 'Sim' },
    { value: 'NAO', viewValue: 'Não' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GroupFormComponent>
  ) {
    this.form = this.formBuilder.group({
      dataAtestado: ['', Validators.required],
      horaInicio: [''],
      horaTermino: [''],
      diaInteiro: ['', Validators.required],
      imagem: ['', Validators.required],
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    this.form.patchValue({ imagem: file.name });
    this.form.get('imagem')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.form.value,
        imagemFile: this.selectedFile,
      });
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
