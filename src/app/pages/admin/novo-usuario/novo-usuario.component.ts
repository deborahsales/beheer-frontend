import { Component } from '@angular/core';
import { UserFormComponent } from '../../../shared/components/user-form/user-form.component';

@Component({
  selector: 'app-novo-usuario',
  imports: [UserFormComponent],
  templateUrl: './novo-usuario.component.html',
  styleUrl: './novo-usuario.component.scss',
})
export class NovoUsuarioComponent {}
