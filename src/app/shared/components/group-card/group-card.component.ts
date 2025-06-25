import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from '../../../core/interfaces/group';

@Component({
  selector: 'app-group-card',
  imports: [],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss',
})
export class GroupCardComponent {
  @Input() grupo!: Group;
  @Output() cardClick = new EventEmitter<number>();

  onClick() {
    this.cardClick.emit(this.grupo.id);
  }

  getTotalMembros(): string {
    const total: number =
      this.grupo.gestores.length + this.grupo.usuarios.length;
    return `${total} ${total === 1 ? 'membro' : 'membros'}`;
  }
}
