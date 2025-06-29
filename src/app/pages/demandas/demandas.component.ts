import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../../core/interfaces/task';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-demandas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
    CapitalizeFirstPipe,
    CommonModule,
  ],
  templateUrl: './demandas.component.html',
  styleUrl: './demandas.component.scss',
})
export class DemandasComponent {
  isLoading = signal(false);
  searchInput: string = '';
  canManage: boolean = false;
  role: string = 'colaborador';
  today = new Date().getTime();

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.today = today.getTime();
  }

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    if (this.role === 'gestor') {
      this.canManage = true;
    }

    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
      this.filteredTasks = [...this.tasks];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.titulo.toLowerCase().includes(term) ||
        task.descricao.toLowerCase().includes(term)
    );
  }

  createTask() {}

  deleteTask(taskId: number) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (!task) return;

    this.openDialog
      .confirm({
        title: 'Excluir demada',
        message: `Tem certeza que deseja excluir a demanda ${task.titulo}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(taskId);
        }
      });
  }

  private executeDelete(taskId: number): void {
    this.isLoading.set(true);

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.applyFilter();
        this.snackbarService.show('Demanda deletada com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar demanda'
        );
        this.isLoading.set(false);
      },
    });
  }

  isAtrasada(prazo: string): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return new Date(prazo).getTime() < hoje.getTime();
  }
}
