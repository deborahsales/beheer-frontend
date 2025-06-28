import { Component, EventEmitter, Inject, Output, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../core/interfaces/user';
import { GroupService } from '../../../core/services/group.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { UserService } from '../../../core/services/user.service';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-user-selection',
  imports: [UserAvatarComponent, SearchBarComponent, ProgressSpinnerComponent],
  templateUrl: './user-selection.component.html',
  styleUrl: './user-selection.component.scss',
})
export class UserSelectionComponent {
  groupId!: number;
  users: User[] = [];
  filteredUsers: any[] = [];
  searchInput = '';
  isLoading = signal(false);

  selected: number[] = [];
  funcao: string = '';
  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() closed = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { groupId: number; funcao: string },
    private dialogRef: MatDialogRef<UserSelectionComponent>,
    private userService: UserService,
    private groupService: GroupService,
    private snackbarService: SnackbarService
  ) {
    this.groupId = data.groupId;
    this.funcao = data.funcao;
  }

  ngOnInit() {
    if (this.funcao === 'GESTOR') {
      this.loadGrupoGestores();
      this.loadAllGestores();
    } else if (this.funcao === 'COLABORADOR') {
      this.loadGrupoColaboradores();
      this.loadAllColaboradores();
    }
  }

  loadGrupoColaboradores() {
    this.isLoading = signal(true);
    this.groupService.getGroupById(this.groupId).subscribe({
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
    this.groupService.getGroupById(this.groupId).subscribe({
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
      this.users = res;
      this.applyFilter();
      this.isLoading = signal(false);
    });
  }

  loadAllGestores() {
    this.isLoading = signal(true);
    this.userService.getGestores().subscribe((res) => {
      this.users = res;
      this.applyFilter();
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredUsers = this.users
      .filter(
        (user) =>
          user.nome.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
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
      this.filteredUsers.length > 0 &&
      this.filteredUsers.every((u) => this.selected.includes(u.id))
    );
  }

  toggleSelectAllVisible(checked: boolean) {
    if (checked) {
      const newIds = this.filteredUsers
        .map((u) => u.id)
        .filter((id) => !this.selected.includes(id));
      this.selected = [...this.selected, ...newIds];
    } else {
      this.selected = this.selected.filter(
        (id) => !this.filteredUsers.some((u) => u.id === id)
      );
    }
    this.selectionChange.emit(this.selected);
  }

  confirmar() {
    const groupId = this.groupId;
    let groupData: any = {};

    if (this.funcao === 'GESTOR') {
      groupData = { gestores: this.selected };
    } else if (this.funcao === 'COLABORADOR') {
      groupData = { usuarios: this.selected };
    }

    this.groupService.updateGroup(groupId, groupData).subscribe({
      next: () => {
        this.snackbarService.show('Usuários alterados com sucesso.');
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackbarService.show('Erro ao alterar usuários.');
        this.dialogRef.close();
      },
    });
  }
}
