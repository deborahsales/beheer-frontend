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
import { Observable } from 'rxjs';
import { Group } from '../../core/interfaces/group';
import { GroupService } from '../../core/services/group.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { UserSelectionComponent } from '../../shared/components/user-selection/user-selection.component';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private openDialog: OpenDialogService
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
  }

  openMember(userId: number) {}

  addMembers(groupId: number, funcao: string) {
    const dialogRef = this.openDialog.open(UserSelectionComponent, {
      groupId,
      funcao,
    });

    if (dialogRef instanceof Observable) {
      dialogRef.subscribe((confirmed) => {
        if (confirmed === true) {
          this.reloadGroup();
        }
      });
    }
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
