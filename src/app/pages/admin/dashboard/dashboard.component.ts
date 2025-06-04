import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ContainerComponent } from '../../../components/container/container.component';
import { ModalExclusaoComponent } from '../../../components/modal-exclusao/modal-exclusao.component';
import { User } from '../../../core/interfaces/user';
import { CapitalizeFirstPipe } from '../../../core/pipes/capitalize-first.pipe';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    CapitalizeFirstPipe,
    ContainerComponent,
    MatProgressSpinnerModule,
    ModalExclusaoComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class AdminDashboardComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchInput = '';

  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isLoading = signal(false);

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = [...this.users];
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.nome.toLowerCase().includes(term)
    );
  }

  createUser() {}

  editUser(userId: string) {}

  deleteUser(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;

    const dialogRef = this.dialog.open(ModalExclusaoComponent, {
      data: { nome: user.nome },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading.set(true);

        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.users = this.users.filter((u) => u.id !== userId);
            this.applyFilter();
            this.isLoading.set(false);
            this._snackBar.open('Usuário deletado com sucesso', 'Fechar', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
          },
          error: (err) => {
            this.isLoading.set(false);
            console.error(err);
            this._snackBar.open(
              err.error.message || 'Erro ao deletar usuário',
              'Fechar',
              {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              }
            );
          },
        });
      }
    });
  }
}
