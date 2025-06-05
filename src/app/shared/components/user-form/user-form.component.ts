import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../core/interfaces/user';
import { ContainerComponent } from '../container/container.component';

interface Funcao {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-form',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    ContainerComponent,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  userForm!: FormGroup;
  isDisabled: boolean = true;

  @Input() user?: User;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  Funcoes: Funcao[] = [
    { value: 'admin-0', viewValue: 'ADMINISTRADOR' },
    { value: 'gestor-1', viewValue: 'GESTOR' },
    { value: 'colaborador-2', viewValue: 'COLABORADOR' },
    { value: 'rh-3', viewValue: 'RH' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      nome: [null, Validators.required],
      cpf: [null, [Validators.required, Validators.minLength(11)]],
      dataNascimento: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, Validators.required],
      telefone: [null, Validators.required],
      cargo: [null, Validators.required],
      funcao: [null, Validators.required],
      dataAdmissao: [null, Validators.required],
      dataDesligamento: [{ value: null, disabled: true }],
    });
  }

  onClick() {}
}
