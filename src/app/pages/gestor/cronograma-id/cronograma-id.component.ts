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
import { Task } from '../../../core/interfaces/task';
import { Timeline } from '../../../core/interfaces/timeline';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TaskService } from '../../../core/services/task.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { UserService } from '../../../core/services/user.service';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
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
    private snackbarService: SnackbarService
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
      this.timelineService.getTimelineById(this.timelineId).subscribe({
        next: (timeline) => {
          this.timeline = timeline;

          this.form.patchValue({
            titulo: timeline.titulo,
            descricao: timeline.descricao,
          });

          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }

    this.taskService.getTasksByTimeline(this.timelineId).subscribe((data) => {
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

  edit() {
    this.isEditing = signal(true);
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
              this.isEditing = signal(false);
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
    this.isEditing = signal(false);
  }

  addTasks(timelineId: number) {}
}
