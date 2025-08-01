import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { Task } from '../../core/interfaces/task';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { TaskFormComponent } from '../../shared/components/task-form/task-form.component';
import { TasksTableComponent } from '../../shared/components/tasks-table/tasks-table.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TasksKanbanComponent } from '../../shared/components/tasks-kanban/tasks-kanban.component';

@Component({
  selector: 'app-demandas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    CommonModule,
    TasksTableComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    TasksKanbanComponent,
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
  isChecked = false;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  statusFilterControl = new FormControl('');
  statusFilter?: string;

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

    this.statusFilterControl.valueChanges.subscribe((value) => {
      const safeValue = value ?? '';
      this.statusFilter = safeValue;
      this.filterByStatus(safeValue);
    });
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

  filterByStatus(status: string) {
    if (!status) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    const statusLower = status.toLowerCase();

    this.filteredTasks = this.tasks.filter((task) =>
      task.status.toLowerCase().includes(statusLower)
    );
  }

  reset() {
    this.statusFilterControl.setValue('');
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.titulo.toLowerCase().includes(term) ||
        task.descricao.toLowerCase().includes(term)
    );
  }

  createTask() {
    this.openDialog
      .open<
        TaskFormComponent,
        void,
        { nome: string; descricao: string; prazo: string; prioridade: string }
      >(TaskFormComponent)
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: {
    nome: string;
    descricao: string;
    prazo: string;
    prioridade: string;
  }) {
    this.isLoading.set(true);
    this.taskService.createTask(data).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.applyFilter();
        this.isLoading.set(false);
        this.snackbarService.show('Demanda criada com sucesso');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(err.error.message || 'Erro ao criar demanda');
      },
    });
  }

  openTask(id: number) {
    this.router.navigate([`/${this.role}/demanda`, id]);
  }

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

  isAtrasada(prazo: string, status: string): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return (
      new Date(prazo).getTime() < hoje.getTime() && status !== 'FINALIZADA'
    );
  }

  handleUpdateStatus(event: { id: number; status: string }): void {
    this.updateStatus(event.id, event.status);
  }

  updateStatus(taskId: number, status: string) {
    this.isLoading.set(true);
    const taskStatus = { status: status };

    this.taskService.updateTaskStatus(taskId, taskStatus).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.snackbarService.show('Erro ao alterar status.');
        this.isLoading.set(false);
      },
    });
  }
}
