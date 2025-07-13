import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdjustmentRequest } from '../../core/interfaces/adjustment-request';
import { AdjustmentRequestService } from '../../core/services/adjustment-requests.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-solicitacoes-ajuste',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
  ],
  templateUrl: './solicitacoes-ajuste.component.html',
  styleUrl: './solicitacoes-ajuste.component.scss',
})
export class SolicitacoesAjusteComponent {
  adjustmentRequests: AdjustmentRequest[] = [];
  filteredAdjustmentRequests: AdjustmentRequest[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = false;
  role: string = 'colaborador';

  constructor(
    private adjustmentRequestService: AdjustmentRequestService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    this.adjustmentRequestService.getAdjustmentRequests().subscribe((data) => {
      this.adjustmentRequests = data;
      this.filteredAdjustmentRequests = [...this.adjustmentRequests];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredAdjustmentRequests = this.adjustmentRequests.filter(
      (adjustmentRequest) =>
        adjustmentRequest.status.toLowerCase().includes(term)
    );
  }

  openAdjustmentRequest(id: number) {
    this.router.navigate([`/${this.role}/atestado`, id]);
  }

  openRequest() {}
}
