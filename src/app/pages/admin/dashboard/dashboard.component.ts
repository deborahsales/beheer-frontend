import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContainerComponent } from '../../../components/container/container.component';
import { User } from '../../../core/interfaces/user';
import { CapitalizeFirstPipe } from '../../../core/pipes/capitalize-first.pipe';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    CapitalizeFirstPipe,
    ContainerComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class AdminDashboardComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchInput = '';
  isLoading = signal(false);

  constructor(
    private userService: UserService,
    private confirmDialog: ConfirmDialogService,
    private snackbarService: SnackbarService
  ) {}

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

    this.confirmDialog
      .confirm({
        title: 'Excluir usuário',
        message: `Tem certeza que deseja excluir o usuário ${user.nome}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(userId);
        }
      });
  }

  private executeDelete(userId: string): void {
    this.isLoading.set(true);

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== userId);
        this.applyFilter();
        this.snackbarService.show('Usuário deletado com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar usuário'
        );
        this.isLoading.set(false);
      },
    });
  }
}
