import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../core/interfaces/group';
import { Task } from '../../core/interfaces/task';
import { User } from '../../core/interfaces/user';
import { GroupService } from '../../core/services/group.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TasksTableComponent } from '../../shared/components/tasks-table/tasks-table.component';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuario-id',
  imports: [
    ProgressSpinnerComponent,
    ContainerComponent,
    SearchBarComponent,
    TasksTableComponent,
    UserAvatarComponent,
    MatIconModule,
  ],
  templateUrl: './usuario-id.component.html',
  styleUrl: './usuario-id.component.scss',
})
export class UsuarioIdComponent {
  userId!: number;
  user!: User;
  isLoading = signal(false);
  canManage: boolean = false;
  role: string = 'colaborador';

  groups: Group[] = [];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchInput: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private taskService: TaskService,
    private groupService: GroupService,
    private router: Router
  ) {}

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

    this.userId = Number(this.route.snapshot.paramMap.get('id')!);

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }

    this.groupService.getGroupsByUser(this.userId).subscribe((data) => {
      this.groups = data;
      this.isLoading = signal(false);
    });

    this.taskService.getTasksByUser(this.userId).subscribe((data) => {
      this.tasks = data;
      this.filteredTasks = [...this.tasks];
      this.isLoading = signal(false);
    });
  }

  openGroup(id: number) {
    this.router.navigate([`/${this.role}/grupo`, id]);
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredTasks = this.tasks.filter(
      (task) =>
        task.titulo.toLowerCase().includes(term) ||
        task.descricao.toLowerCase().includes(term)
    );
  }

  editUser() {
    this.router.navigate(['/administrador/usuarios', this.userId, 'editar']);
  }
}
