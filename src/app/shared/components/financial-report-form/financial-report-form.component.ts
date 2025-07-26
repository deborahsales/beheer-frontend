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
  selector: 'app-financial-report-form',
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
  templateUrl: './financial-report-form.component.html',
  styleUrl: './financial-report-form.component.scss',
})
export class FinancialReportFormComponent {
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GroupFormComponent>
  ) {
    this.form = this.formBuilder.group({
      data: ['', Validators.required],
      valor: ['', Validators.required],
      descricao: ['', Validators.required],
      imagem: ['', Validators.required],
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
