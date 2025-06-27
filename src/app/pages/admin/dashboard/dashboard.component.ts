import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { OpenDialogService } from '../../../core/services/open-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { UserService } from '../../../core/services/user.service';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { CapitalizeFirstPipe } from '../../../shared/pipes/capitalize-first.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    CapitalizeFirstPipe,
    InitialsPipe,
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    UserAvatarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class AdminDashboardComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchInput = '';
  isLoading = signal(false);
  canCreate: boolean = true;

  constructor(
    private userService: UserService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = [...this.users];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.nome.toLowerCase().includes(term)
    );
  }

  createUser() {
    this.router.navigate(['/admin/novo-usuario']);
  }

  editUser(userId: string) {
    this.router.navigate(['/admin/usuarios', userId, 'editar']);
  }

  deleteUser(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;

    this.openDialog
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
