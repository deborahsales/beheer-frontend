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
import { GroupService } from '../../core/services/group.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-grupo-id',
  imports: [
    ContainerComponent,
    InitialsPipe,
    ProgressSpinnerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './grupo-id.component.html',
  styleUrl: './grupo-id.component.scss',
})
export class GrupoIdComponent {
  groupId!: string;
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
    private userService: UserService
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

    this.groupId = this.route.snapshot.paramMap.get('id')!;

    if (this.groupId) {
      this.groupService.getGroupById(this.groupId).subscribe({
        next: (group) => {
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

  addManagers() {}
  addMembers() {}
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
