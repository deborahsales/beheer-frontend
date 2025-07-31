import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { merge } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ProgressSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', Validators.required);

  isLoading = signal(false);

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordErrorMessage());
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('Você precisa informar um e-mail');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('E-mail inválido');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.passwordErrorMessage.set('Você precisa informar uma senha');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    const emailValue = this.email.value;
    const passwordValue = this.password.value;

    this.isLoading.set(true);

    this.authService.autenticar(emailValue!, passwordValue!).subscribe({
      next: (value) => {
        this.isLoading.set(false);
        this.userService.getAuthUser().subscribe((user) => {
          if (user) {
            const funcao = user.funcao;

            if (funcao == 'ADMINISTRADOR') {
              this.router.navigateByUrl('/administrador');
            } else if (funcao == 'GESTOR') {
              this.router.navigateByUrl('/gestor');
            } else if (funcao == 'COLABORADOR') {
              this.router.navigateByUrl('/colaborador');
            } else if (funcao == 'RH') {
              this.router.navigateByUrl('/rh');
            }
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(
          err.error.message || 'Erro ao realizar login'
        );
      },
    });
  }
}
