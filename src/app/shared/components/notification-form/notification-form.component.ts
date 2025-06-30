import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserSelectionComponent } from '../user-selection/user-selection.component';

@Component({
  selector: 'app-notification-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    UserSelectionComponent,
  ],
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent {
  form: FormGroup;
  step: number = 1;
  selectedUserIds: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<NotificationFormComponent>
  ) {
    this.form = this.formBuilder.group({
      assunto: ['', Validators.required],
      conteudo: ['', Validators.required],
    });
  }

  onSubmit(idsSelecionados: number[]) {
    if (this.form.valid) {
      const dadosComUsuarios = {
        ...this.form.value,
        avisoUsuario: idsSelecionados,
      };
      this.dialogRef.close(dadosComUsuarios);
    }
  }

  nextStep() {
    if (this.form.valid) {
      this.step = 2;
    }
  }

  previousStep() {
    this.step = 1;
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
