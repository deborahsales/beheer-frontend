import { CommonModule } from '@angular/common';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../core/interfaces/group';
import { Task } from '../../core/interfaces/task';
import { GroupService } from '../../core/services/group.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ItemSelectionComponent } from '../../shared/components/item-selection/item-selection.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TasksTableComponent } from '../../shared/components/tasks-table/tasks-table.component';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-grupo-id',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    UserAvatarComponent,
    TasksTableComponent,
    SearchBarComponent,
  ],
  templateUrl: './grupo-id.component.html',
  styleUrl: './grupo-id.component.scss',
})
export class GrupoIdComponent {
  groupId!: number;
  isLoading = signal(false);
  isEditing = signal(false);
  group!: Group;
  form: FormGroup;
  canManage: boolean = false;
  role: string = 'colaborador';

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchInput: string = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private openDialog: OpenDialogService,
    private taskService: TaskService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
    });
  }

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

    this.groupId = Number(this.route.snapshot.paramMap.get('id')!);

    if (this.groupId) {
      this.groupService.getGroupById(this.groupId).subscribe({
        next: (group) => {
          group.usuarios = group.usuarios.sort((a, b) =>
            a.usuario.nome.localeCompare(b.usuario.nome)
          );

          group.gestores = group.gestores.sort((a, b) =>
            a.usuario.nome.localeCompare(b.usuario.nome)
          );

          this.group = group;

          this.form.patchValue({
            nome: group.nome,
            descricao: group.descricao,
          });

          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }

    this.taskService.getTasksByGroup(this.groupId).subscribe((data) => {
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

  openMember(userId: number) {
    this.router.navigate([`/${this.role}/usuario`, userId]);
  }

  addMembers(groupId: number, funcao: string) {
    this.openDialog
      .open<
        ItemSelectionComponent,
        { id: number; funcao: string; title: string },
        number[]
      >(ItemSelectionComponent, {
        id: groupId,
        funcao,
        title: 'Editar usuários',
      })
      .subscribe((selected) => {
        if (selected && selected.length > 0) {
          this.executeAddNewMember(selected, groupId, funcao);
        }
        this.reloadGroup();
      });
  }

  private executeAddNewMember(
    selected: number[],
    groupId: number,
    funcao: string
  ) {
    this.isLoading.set(true);
    let groupData: any = {};

    if (funcao === 'GESTOR') {
      groupData = { gestores: selected };
    } else if (funcao === 'COLABORADOR') {
      groupData = { usuarios: selected };
    }

    this.groupService.updateGroup(groupId, groupData).subscribe({
      next: () => {
        this.snackbarService.show('Usuários alterados com sucesso.');
      },
      error: () => {
        this.snackbarService.show('Erro ao alterar usuários.');
      },
    });
  }

  private reloadGroup() {
    this.isLoading.set(true);

    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        group.usuarios = group.usuarios.sort((a, b) =>
          a.usuario.nome.localeCompare(b.usuario.nome)
        );

        group.gestores = group.gestores.sort((a, b) =>
          a.usuario.nome.localeCompare(b.usuario.nome)
        );

        this.group = group;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackbarService.show('Erro ao recarregar grupo.');
      },
    });
  }

  edit() {
    this.isEditing = signal(true);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      const dadosAtualizados = {
        nome: this.form.get('nome')!.value,
        descricao: this.form.get('descricao')!.value,
      };

      if (dadosAtualizados) {
        this.groupService
          .updateGroup(this.group.id, dadosAtualizados)
          .subscribe({
            next: (value) => {
              this.group = {
                ...this.group,
                ...dadosAtualizados,
              };
              this.isLoading.set(false);
              this.snackbarService.show('Grupo editado com sucesso');
              this.isEditing = signal(false);
            },
            error: (err) => {
              this.isLoading.set(false);
              this.snackbarService.show(
                err.error.message || 'Erro ao editar grupo'
              );
            },
          });
      }
    }
  }

  onCancel() {
    this.isEditing = signal(false);
  }
}
