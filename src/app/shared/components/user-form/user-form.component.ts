import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
import { FormsService } from '../../../core/services/forms.service';
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
  titulo: string = 'Cadastrar usuário';
  textoBotao: string = 'Cadastrar';

  @Input() isEditing: boolean = false;
  @Input() usuario!: User;
  @Output() acaoClique = new EventEmitter<void>();

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  Funcoes: Funcao[] = [
    { value: 'ADMINISTRADOR', viewValue: 'Administrador' },
    { value: 'GESTOR', viewValue: 'Gestor' },
    { value: 'COLABORADOR', viewValue: 'Colaborador' },
    { value: 'RH', viewValue: 'RH' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private formsService: FormsService
  ) {}

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

    if (this.isEditing) {
      this.carregarFormulario();
      this.titulo = 'Editar usuário';
      this.textoBotao = 'Editar';
      this.userForm.get('dataDesligamento')?.enable();

      Object.keys(this.userForm.controls).forEach((field) => {
        const control = this.userForm.get(field);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
    }

    this.formsService.setCadastro(this.userForm);
  }

  onClick() {
    this.acaoClique.emit();
  }

  carregarFormulario() {
    this.userForm?.patchValue({
      nome: this.usuario.nome,
      cpf: this.usuario.cpf,
      email: this.usuario.email,
      dataNascimento: this.usuario.dataNascimento,
      telefone: this.usuario.telefone,
      cargo: this.usuario.cargo,
      funcao: this.usuario.funcao,
      dataAdmissao: this.usuario.dataAdmissao,
      dataDesligamento: this.usuario.dataDesligamento,
    });
  }
}
