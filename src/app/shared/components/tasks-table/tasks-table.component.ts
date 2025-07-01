import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../../../core/interfaces/task';
import { OpenDialogService } from '../../../core/services/open-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TaskService } from '../../../core/services/task.service';
import { CapitalizeFirstPipe } from '../../pipes/capitalize-first.pipe';

@Component({
  selector: 'app-tasks-table',
  imports: [CapitalizeFirstPipe, DatePipe],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
})
export class TasksTableComponent {
  @Input() canManage!: boolean;
  @Input() role!: string;
  @Input() tasks!: Task[];
  @Input() filteredTasks!: Task[];

  @Output() filter = new EventEmitter<void>();
  isLoading = signal(false);

  applyFilter() {
    this.filter.emit();
  }

  constructor(
    private router: Router,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private taskService: TaskService
  ) {}

  isAtrasada(prazo: string, status: string): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return (
      new Date(prazo).getTime() < hoje.getTime() && status !== 'FINALIZADA'
    );
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
}
