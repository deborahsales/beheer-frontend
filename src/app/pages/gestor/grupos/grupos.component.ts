import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../../../core/interfaces/group';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { GroupService } from '../../../core/services/group.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../../shared/components/features-header/features-header.component';
import { GroupCardComponent } from '../../../shared/components/group-card/group-card.component';

@Component({
  selector: 'app-grupos',
  imports: [GroupCardComponent, ContainerComponent, FeaturesHeaderComponent],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss',
})
export class GruposComponent {
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  searchInput: string = '';
  isLoading = signal(false);

  constructor(
    private groupService: GroupService,
    private confirmDialog: ConfirmDialogService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.groupService.getGroups().subscribe((data) => {
      this.groups = data;
      this.filteredGroups = [...this.groups];
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredGroups = this.groups.filter((group) =>
      group.nome.toLowerCase().includes(term)
    );
  }

  openGroup(id: number) {
    console.log(`Grupo ${id} clicado`);
  }

  deleteGroup(groupId: number) {
    const group = this.groups.find((u) => u.id === groupId);
    if (!group) return;

    this.confirmDialog
      .confirm({
        title: 'Excluir grupo',
        message: `Tem certeza que deseja excluir o grupo ${group.nome}?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(groupId);
        }
      });
  }

  private executeDelete(groupId: number): void {
    this.isLoading.set(true);

    this.groupService.deleteGroup(groupId).subscribe({
      next: () => {
        this.groups = this.groups.filter((u) => u.id !== groupId);
        this.applyFilter();
        this.snackbarService.show('Grupo deletado com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar grupo'
        );
        this.isLoading.set(false);
      },
    });
  }
}
