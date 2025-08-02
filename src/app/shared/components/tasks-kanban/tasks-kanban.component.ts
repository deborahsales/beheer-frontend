import {
  CardClickEventArgs,
  KanbanModule,
} from '@syncfusion/ej2-angular-kanban';

import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CardSettingsModel } from '@syncfusion/ej2-angular-kanban';
import { Task } from '../../../core/interfaces/task';

import { Router } from '@angular/router';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { UserService } from '../../../core/services/user.service';

setCulture('pt-BR');
L10n.load({
  'pt-BR': {
    kanban: {
      items: 'itens',
      item: 'item',
      noCard: 'Nenhuma demanda para exibir',
    },
  },
});

@Component({
  selector: 'app-tasks-kanban',
  imports: [KanbanModule],
  templateUrl: './tasks-kanban.component.html',
  styleUrl: './tasks-kanban.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TasksKanbanComponent {
  @Input() filteredTasks!: Task[];
  @Output() updateStatus = new EventEmitter<{ id: number; status: string }>();
  @Output() openTask = new EventEmitter<number>();
  role!: string;

  public cardSettings: CardSettingsModel = {
    contentField: 'descricao',
    headerField: 'titulo',
  };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });
  }

  onCardDoubleClick(args: CardClickEventArgs): void {
    args.cancel = true;
  }

  onCardClick(args: CardClickEventArgs): void {
    args.cancel = true;
    const cardData = args.data;
    const cardId = cardData['id'];
    this.router.navigate([`/${this.role}/demanda`, cardId]);
  }

  onDragStop(args: any): void {
    let element = args.event.target as HTMLElement | null;
    const card = args.data[0];
    const id = card.id;

    while (element && !element.classList.contains('e-content-cells')) {
      element = element.parentElement;
    }

    if (element) {
      const columnKey = element.getAttribute('data-key');
      if (columnKey) {
        this.updateStatus.emit({ id, status: columnKey });
      }
    }
  }
}
