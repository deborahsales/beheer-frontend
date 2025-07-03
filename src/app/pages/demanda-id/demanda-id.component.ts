import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../core/interfaces/task';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-demanda-id',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    UserAvatarComponent,
    CapitalizeFirstPipe,
  ],
  templateUrl: './demanda-id.component.html',
  styleUrl: './demanda-id.component.scss',
})
export class DemandaIdComponent {
  taskId!: number;
  isLoading = signal(false);
  canManage: boolean = false;
  role: string = 'colaborador';
  task!: Task;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = signal(true);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    if (this.role === 'gestor') {
      this.canManage = true;
    }

    this.taskId = Number(this.route.snapshot.paramMap.get('id')!);

    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.task = task;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  openGroup(id: number) {
    this.router.navigate([`/${this.role}/grupo`, id]);
  }

  openUser(userId: number) {
    this.router.navigate([`/${this.role}/usuario`, userId]);
  }

  isAtrasada(prazo: string, status: string): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return (
      new Date(prazo).getTime() < hoje.getTime() && status !== 'FINALIZADA'
    );
  }
}
