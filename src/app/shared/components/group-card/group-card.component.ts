import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from '../../../core/interfaces/group';

@Component({
  selector: 'app-group-card',
  imports: [],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.scss',
})
export class GroupCardComponent {
  @Input() group!: Group;
  @Output() cardClick = new EventEmitter<number>();
  @Output() groupDelete = new EventEmitter<number>();

  onClick() {
    this.cardClick.emit(this.group.id);
  }

  onDelete() {
    this.groupDelete.emit(this.group.id);
  }

  getTotalMembros(): string {
    const total: number =
      this.group.gestores.length + this.group.usuarios.length;
    return `${total} ${total === 1 ? 'membro' : 'membros'}`;
  }
}
