import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../../core/interfaces/group';
import { GroupService } from '../../core/services/group.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { GroupCardComponent } from '../../shared/components/group-card/group-card.component';
import { GroupFormComponent } from '../../shared/components/group-form/group-form.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-grupos',
  imports: [
    GroupCardComponent,
    ContainerComponent,
    FeaturesHeaderComponent,
    ProgressSpinnerComponent,
  ],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss',
})
export class GruposComponent {
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = true;

  constructor(
    private groupService: GroupService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = signal(true);

    this.groupService.getGroups().subscribe((data) => {
      this.groups = data;
      this.filteredGroups = [...this.groups];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredGroups = this.groups.filter((group) =>
      group.nome.toLowerCase().includes(term)
    );
  }

  openGroup(id: number) {
    this.router.navigate(['/gestor/grupo', id]);
  }

  createGroup() {
    this.openDialog
      .open<GroupFormComponent, void, { nome: string; descricao: string }>(
        GroupFormComponent
      )
      .subscribe((result) => {
        if (result) {
          console.log('Form recebido:', result.nome, result.descricao);
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: { nome: string; descricao: string }) {
    this.isLoading.set(true);
    this.groupService.createGroup(data).subscribe({
      next: (newGroup) => {
        this.groups.push(newGroup);
        this.applyFilter();
        this.isLoading.set(false);
        this.snackbarService.show('Grupo criado com sucesso');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(err.error.message || 'Erro ao criar grupo');
      },
    });
  }

  deleteGroup(groupId: number) {
    const group = this.groups.find((u) => u.id === groupId);
    if (!group) return;

    this.openDialog
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
