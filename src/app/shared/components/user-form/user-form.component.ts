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
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { User } from '../../../core/interfaces/user';
import { FormsService } from '../../../core/services/forms.service';
import { AppDateAdapter } from '../../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../../core/utils/date-format';
import { cpfLengthValidator } from '../../../core/validators/cpf-length.validator';
import { noFutureDateValidator } from '../../../core/validators/date.validator';
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
    NgxMaskDirective,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideNgxMask(),
  ],
})
export class UserFormComponent {
  userForm!: FormGroup;
  titulo: string = 'Cadastrar usuário';
  textoBotao: string = 'Cadastrar';

  @Input() isEditing: boolean = false;
  @Input() usuario!: User;
  @Output() acaoClique = new EventEmitter<void>();
  @Output() acaoCancela = new EventEmitter<void>();

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
      cpf: [null, [Validators.required, cpfLengthValidator()]],
      dataNascimento: [null, [Validators.required, noFutureDateValidator()]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, Validators.required],
      telefone: [null, Validators.required],
      cargo: [null, Validators.required],
      funcao: [null, Validators.required],
      dataAdmissao: [null, [Validators.required, noFutureDateValidator()]],
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

  onCancel() {
    this.acaoCancela.emit();
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
