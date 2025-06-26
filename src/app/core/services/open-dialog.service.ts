import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModalExclusaoComponent } from '../../shared/components/modal-exclusao/modal-exclusao.component';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OpenDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ModalExclusaoComponent, {
      data,
    });

    return dialogRef.afterClosed();
  }

  open<T, D = any, R = unknown>(
    component: ComponentType<T>,
    data?: D
  ): Observable<R> {
    const dialogRef = this.dialog.open(component, {
      data,
    });

    return dialogRef.afterClosed() as Observable<R>;
  }
}
