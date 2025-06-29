import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { FormsService } from '../../../core/services/forms.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { UserService } from '../../../core/services/user.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { UserFormComponent } from '../../../shared/components/user-form/user-form.component';

@Component({
  selector: 'app-editar-usuario',
  imports: [ProgressSpinnerComponent, UserFormComponent],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
})
export class EditarUsuarioComponent {
  isEditing = true;
  isLoading = signal(true);
  userId!: number;
  usuario!: User;

  constructor(
    private formsService: FormsService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id')!);

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.usuario = user;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  editar() {
    this.isLoading.set(true);

    const formsUser = this.formsService.getCadastro()?.getRawValue() as User;

    const dadosAtualizados = {
      nome: formsUser.nome,
      cpf: formsUser.cpf,
      email: formsUser.email,
      senha: formsUser.senha,
      dataNascimento: formsUser.dataNascimento,
      telefone: formsUser.telefone,
      cargo: formsUser.cargo,
      funcao: formsUser.funcao,
      dataAdmissao: formsUser.dataAdmissao,
      dataDesligamento: formsUser.dataDesligamento,
    };

    if (dadosAtualizados.senha == null) {
      delete dadosAtualizados.senha;
    }

    if (dadosAtualizados) {
      this.userService.updateUser(this.userId, dadosAtualizados).subscribe({
        next: (value) => {
          this.isLoading.set(false);
          this.snackbarService.show('Usuário editado com sucesso');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackbarService.show(
            err.error.message || 'Erro ao editar usuário'
          );
        },
      });
    }
  }
}
