import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Notification } from '../../core/interfaces/notification';
import { NotificationService } from '../../core/services/notification.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { NotificationFormComponent } from '../../shared/components/notification-form/notification-form.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-avisos',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
  ],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.scss',
})
export class AvisosComponent {
  isLoading = signal(false);
  searchInput: string = '';
  canManage: boolean = false;
  role: string = 'colaborador';
  userId!: number;
  userName!: string;

  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService
      .getAuthUser()
      .pipe(
        map((user) => {
          this.userId = user?.sub || 0;
          this.userName = user?.nome || '';
          this.role = user?.funcao.toLowerCase() || '';
        })
      )
      .subscribe();

    if (
      this.role === 'gestor' ||
      this.role === 'administrador' ||
      this.role === 'rh'
    ) {
      this.canManage = true;
    }

    this.notificationService.getNotifications().subscribe((data) => {
      this.notifications = data;
      this.filteredNotifications = [...this.notifications];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredNotifications = this.notifications.filter(
      (notification) =>
        notification.assunto.toLowerCase().includes(term) ||
        notification.conteudo.toLowerCase().includes(term)
    );
  }

  openNotification(notificationId: number, remetenteId: number) {
    if (remetenteId === this.userId) {
      this.router.navigate([`/${this.role}/aviso`, notificationId]);
    } else {
      this.notificationService.readNotification(notificationId).subscribe({
        next: () => {
          this.router.navigate([`/${this.role}/aviso`, notificationId]);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.snackbarService.show(
            err.error?.message || 'Erro ao abrir aviso'
          );
          this.isLoading.set(false);
        },
      });
    }
  }

  createNotification() {
    this.openDialog
      .open<
        NotificationFormComponent,
        void,
        { nome: string; descricao: string }
      >(NotificationFormComponent)
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: { nome: string; descricao: string }) {
    this.isLoading.set(true);
    this.notificationService.createNotification(data).subscribe({
      next: (newNotification) => {
        newNotification.gestorRhUsuarioId = this.userId;
        newNotification.gestor = { id: this.userId, nome: this.userName };
        newNotification.avisoUsuario = [];
        this.notifications.push(newNotification);
        this.applyFilter();
        this.isLoading.set(false);
        this.snackbarService.show('Aviso criado com sucesso');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(err.error.message || 'Erro ao criar aviso');
      },
    });
  }

  readNotification(notificationId: number): void {
    this.isLoading.set(true);

    this.notificationService.readNotification(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(
          (n) => n.id === notificationId
        );
        if (notification && notification.avisoUsuario.length > 0) {
          notification.avisoUsuario[0].status = 'LIDO';
        }
        this.snackbarService.show('Aviso marcado como lido');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao marcar aviso como lido'
        );
        this.isLoading.set(false);
      },
    });
  }

  deleteNotification(notificationId: number) {
    const notification = this.notifications.find(
      (notification) => notification.id === notificationId
    );
    if (!notification) return;

    this.openDialog
      .confirm({
        title: 'Excluir aviso',
        message: `Tem certeza que deseja excluir o aviso ${notification.assunto}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(notificationId);
        }
      });
  }

  private executeDelete(notificationId: number): void {
    this.isLoading.set(true);

    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(
          (notification) => notification.id !== notificationId
        );
        this.applyFilter();
        this.snackbarService.show('Aviso deletado com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar aviso'
        );
        this.isLoading.set(false);
      },
    });
  }
}
