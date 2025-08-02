import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Task } from '../../../core/interfaces/task';
import { Timeline } from '../../../core/interfaces/timeline';
import { OpenDialogService } from '../../../core/services/open-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TaskService } from '../../../core/services/task.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { UserService } from '../../../core/services/user.service';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { ItemSelectionComponent } from '../../../shared/components/item-selection/item-selection.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { TaskFormComponent } from '../../../shared/components/task-form/task-form.component';
import { TasksTableComponent } from '../../../shared/components/tasks-table/tasks-table.component';

@Component({
  selector: 'app-cronograma-id',
  imports: [
    ProgressSpinnerComponent,
    ContainerComponent,
    DatePipe,
    TasksTableComponent,
    SearchBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './cronograma-id.component.html',
  styleUrl: './cronograma-id.component.scss',
})
export class CronogramaIdComponent {
  timelineId!: number;
  isLoading = signal(false);
  timeline!: Timeline;
  userId!: number;
  canManage: boolean = false;
  role: string = 'colaborador';
  isEditing = signal(false);
  form: FormGroup;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchInput: string = '';

  constructor(
    private route: ActivatedRoute,
    private timelineService: TimelineService,
    private userService: UserService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private openDialog: OpenDialogService
  ) {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.timelineId = Number(this.route.snapshot.paramMap.get('id')!);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    if (this.role === 'gestor') {
      this.canManage = true;
    }

    if (this.timelineId) {
      forkJoin({
        timeline: this.timelineService.getTimelineById(this.timelineId),
        tasks: this.taskService.getTasksByTimeline(this.timelineId),
      }).subscribe({
        next: ({ timeline, tasks }) => {
          this.timeline = timeline;

          this.form.patchValue({
            titulo: timeline.titulo,
            descricao: timeline.descricao,
          });

          this.tasks = tasks;
          this.filteredTasks = [...this.tasks];
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.titulo.toLowerCase().includes(term) ||
        task.descricao.toLowerCase().includes(term)
    );
  }

  edit() {
    this.isEditing.set(true);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      const dadosAtualizados = {
        titulo: this.form.get('titulo')!.value,
        descricao: this.form.get('descricao')!.value,
      };

      if (dadosAtualizados) {
        this.timelineService
          .updateTimeline(this.timeline.id, dadosAtualizados)
          .subscribe({
            next: (value) => {
              this.timeline = {
                ...this.timeline,
                ...dadosAtualizados,
              };
              this.isLoading.set(false);
              this.snackbarService.show('Cronograma editado com sucesso');
              this.isEditing.set(false);
            },
            error: (err) => {
              this.isLoading.set(false);
              this.snackbarService.show(
                err.error.message || 'Erro ao editar cronograma'
              );
            },
          });
      }
    }
  }

  onCancel() {
    this.isEditing.set(false);
  }

  createTask() {
    this.openDialog
      .open<
        TaskFormComponent,
        { dataInicio: string; dataTermino: string },
        { nome: string; descricao: string; prazo: string; prioridade: string }
      >(TaskFormComponent, {
        dataInicio: this.timeline.dataInicio,
        dataTermino: this.timeline.dataTermino,
      })
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
    this.taskService
      .createTask({ ...data, cronogramaId: this.timelineId })
      .subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.applyFilter();
          this.isLoading.set(false);
          this.snackbarService.show('Demanda criada com sucesso');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackbarService.show(
            err.error.message || 'Erro ao criar demanda'
          );
        },
      });
  }

  addTasks(timelineId: number) {
    this.openDialog
      .open<
        ItemSelectionComponent,
        { id: number; funcao: string; title: string; isDialog: boolean },
        number[]
      >(ItemSelectionComponent, {
        id: timelineId,
        funcao: 'DEMANDA-CRONOGRAMA',
        title: 'Editar demandas',
        isDialog: true,
      })
      .subscribe((selected) => {
        if (selected) {
          this.executeAddNewTask(selected, timelineId);
        }
      });
  }

  private executeAddNewTask(selected: number[], timelineId: number) {
    this.isLoading.set(true);
    const timelineData: any = { demandasCronograma: selected };

    this.timelineService.updateTimeline(timelineId, timelineData).subscribe({
      next: () => {
        this.snackbarService.show('Dados alterados com sucesso.');
        this.reloadTasks();
      },
      error: () => {
        this.snackbarService.show('Erro ao alterar dados.');
      },
    });
  }

  private reloadTasks() {
    this.isLoading.set(true);

    this.taskService.getTasksByTimeline(this.timelineId).subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackbarService.show('Erro ao recarregar demandas.');
      },
    });
  }

  handleRemoveTask(taskId: number) {
    const task = this.filteredTasks.find((task) => task.id === taskId);
    if (!task) return;

    this.openDialog
      .confirm({
        title: 'Remover demada',
        message: `Tem certeza que deseja remover a demanda desse cronograma?`,
        confirmText: 'Remover',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeRemove(taskId);
        }
      });
  }

  executeRemove(taskId: number) {
    this.isLoading.set(true);

    this.taskService.updateTask(taskId, { cronogramaId: null }).subscribe({
      next: (retorno) => {
        console.log(retorno);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.applyFilter();
        this.snackbarService.show('Tarefa removida com sucesso.');
        this.isLoading.set(false);
      },
      error: () => {
        this.snackbarService.show('Erro ao remover tarefa.');
        this.isLoading.set(false);
      },
    });
  }
}
