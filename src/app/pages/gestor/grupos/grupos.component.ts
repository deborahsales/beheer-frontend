import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from '../../../core/interfaces/group';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { GroupService } from '../../../core/services/group.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { GroupCardComponent } from '../../../shared/components/group-card/group-card.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-grupos',
  imports: [GroupCardComponent, SearchBarComponent, ContainerComponent],
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
}
