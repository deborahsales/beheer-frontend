import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-exclusao',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './modal-exclusao.component.html',
  styleUrl: './modal-exclusao.component.scss',
})
export class ModalExclusaoComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalExclusaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nome: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
