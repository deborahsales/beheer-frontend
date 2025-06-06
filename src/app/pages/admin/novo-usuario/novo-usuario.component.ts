import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { FormsService } from '../../../core/services/forms.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { UserService } from '../../../core/services/user.service';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { UserFormComponent } from '../../../shared/components/user-form/user-form.component';

@Component({
  selector: 'app-novo-usuario',
  imports: [UserFormComponent, ProgressSpinnerComponent],
  templateUrl: './novo-usuario.component.html',
  styleUrl: './novo-usuario.component.scss',
})
export class NovoUsuarioComponent {
  isLoading = signal(false);

  constructor(
    private formsService: FormsService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  cadastrar() {
    this.isLoading.set(true);

    const formsUser = this.formsService.getCadastro();

    if (formsUser?.valid) {
      const novoCadastro = formsUser.getRawValue() as User;
      this.userService.createUser(novoCadastro).subscribe({
        next: (value) => {
          this.isLoading.set(false);
          this.snackbarService.show('Usuário criado com sucesso');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackbarService.show(
            err.error.message || 'Erro ao criar usuário'
          );
        },
      });
    }
  }
}
