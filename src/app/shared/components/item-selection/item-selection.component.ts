import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupService } from '../../../core/services/group.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-item-selection',
  imports: [
    UserAvatarComponent,
    SearchBarComponent,
    ProgressSpinnerComponent,
    MatButtonModule,
  ],
  templateUrl: './item-selection.component.html',
  styleUrl: './item-selection.component.scss',
})
export class ItemSelectionComponent {
  id!: number;
  itens: any[] = [];
  filteredItens: any[] = [];
  searchInput = '';
  isLoading = signal(false);
  userId!: number;
  @Input() title: string = 'Selecionar';
  @Input() steps: boolean = false;

  selected: number[] = [];
  @Input() funcao: string = '';
  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() closed = new EventEmitter<void>();
  @Output() save = new EventEmitter<number[]>();
  @Output() step = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      id: number;
      funcao: string;
      title: string;
    } | null = null,
    private userService: UserService,
    private groupService: GroupService,
    private taskService: TaskService,
    private snackbarService: SnackbarService,
    @Optional() private dialogRef?: MatDialogRef<ItemSelectionComponent>
  ) {
    if (data) {
      this.id = data.id;
      this.funcao = data.funcao;
      this.title = data.title;
    }
  }

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getAuthUser().subscribe((user) => {
      this.userId = user?.sub || 0;

      if (this.id) {
        if (this.funcao === 'GESTOR') {
          this.loadGrupoGestores();
          this.loadAllGestores();
        } else if (this.funcao === 'COLABORADOR') {
          this.loadGrupoColaboradores();
          this.loadAllColaboradores();
        } else if (this.funcao === 'COLABORADOR-DEMANDA') {
          this.loadDemandaUsuarios();
          this.loadAllColaboradores();
        } else if (this.funcao === 'GRUPO-DEMANDA') {
          this.loadDemandaGrupos();
          this.loadAllGroups();
        }
      } else {
        if (this.funcao === 'GRUPO') {
          this.loadAllGroups();
        } else if (this.funcao === 'COLABORADOR') {
          this.loadAllColaboradores();
        } else {
          this.loadAllUsers();
        }
      }
    });
  }

  loadDemandaGrupos() {
    this.isLoading = signal(true);
    this.taskService.getTaskById(this.id).subscribe({
      next: (task) => {
        this.selected =
          task.gruposDemanda?.map((group: any) => group.grupoId) || [];
        this.isLoading = signal(false);
      },
      error: (err) => {
        this.snackbarService.show(err);
        this.isLoading = signal(false);
      },
    });
  }

  loadDemandaUsuarios() {
    this.isLoading = signal(true);
    this.taskService.getTaskById(this.id).subscribe({
      next: (task) => {
        this.selected =
          task.usuariosDemanda?.map((user: any) => user.usuarioId) || [];
        this.isLoading = signal(false);
      },
      error: (err) => {
        this.snackbarService.show(err);
        this.isLoading = signal(false);
      },
    });
  }

  loadGrupoColaboradores() {
    this.isLoading = signal(true);
    this.groupService.getGroupById(this.id).subscribe({
      next: (group) => {
        this.selected =
          group.usuarios?.map((user: any) => user.usuarioId) || [];
        this.isLoading = signal(false);
      },
      error: (err) => {
        this.snackbarService.show(err);
        this.isLoading = signal(false);
      },
    });
  }

  loadGrupoGestores() {
    this.isLoading = signal(true);
    this.groupService.getGroupById(this.id).subscribe({
      next: (group) => {
        this.selected =
          group.gestores?.map((user: any) => user.usuarioId) || [];
        this.isLoading = signal(false);
      },
      error: (err) => {
        this.snackbarService.show(err);
        this.isLoading = signal(false);
      },
    });
  }

  loadAllColaboradores() {
    this.isLoading = signal(true);
    this.userService.getColaboradores().subscribe((res) => {
      this.itens = res;
      this.applyFilter();
      this.isLoading = signal(false);
    });
  }

  loadAllGestores() {
    this.isLoading = signal(true);
    this.userService.getGestores().subscribe((res) => {
      this.itens = res;
      this.applyFilter();
      this.isLoading = signal(false);
    });
  }

  loadAllUsers() {
    this.isLoading = signal(true);
    this.userService.getUsers().subscribe((res) => {
      this.itens = res.filter((user) => user.id !== this.userId);
      this.applyFilter();
      this.isLoading = signal(false);
    });
  }

  loadAllGroups() {
    this.isLoading = signal(true);
    this.groupService.getGroups().subscribe((res) => {
      this.itens = res;
      this.applyFilter();
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredItens = this.itens
      .filter(
        (item) =>
          item.nome.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        const aSelected = this.selected.includes(Number(a.id)) ? 0 : 1;
        const bSelected = this.selected.includes(Number(b.id)) ? 0 : 1;
        return aSelected - bSelected;
      });
  }

  onSelectAllVisible(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input?.checked ?? false;
    this.toggleSelectAllVisible(isChecked);
  }

  onSelect(id: number, event: any) {
    if (event.target.checked) {
      if (!this.selected.includes(id)) {
        this.selected = [...this.selected, id];
      }
    } else {
      this.selected = this.selected.filter((i) => i !== id);
    }
    this.selectionChange.emit(this.selected);
  }

  allVisibleSelected(): boolean {
    return (
      this.filteredItens.length > 0 &&
      this.filteredItens.every((u) => this.selected.includes(u.id))
    );
  }

  toggleSelectAllVisible(checked: boolean) {
    if (checked) {
      const newIds = this.filteredItens
        .map((u) => u.id)
        .filter((id) => !this.selected.includes(id));
      this.selected = [...this.selected, ...newIds];
    } else {
      this.selected = this.selected.filter(
        (id) => !this.filteredItens.some((u) => u.id === id)
      );
    }
    this.selectionChange.emit(this.selected);
  }

  onSave() {
    if (this.dialogRef) {
      this.dialogRef.close(this.selected);
    } else {
      this.save.emit(this.selected);
    }
  }

  previousStep() {
    this.step.emit();
  }
}
