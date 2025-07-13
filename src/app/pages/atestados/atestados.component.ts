import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalCertificate } from '../../core/interfaces/medical-certificate';
import { MedicalCertificateService } from '../../core/services/medical-certificate.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-atestados',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
    CapitalizeFirstPipe,
  ],
  templateUrl: './atestados.component.html',
  styleUrl: './atestados.component.scss',
})
export class AtestadosComponent {
  medicalCertificates: MedicalCertificate[] = [];
  filteredMedicalCertificates: MedicalCertificate[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = false;
  role: string = 'colaborador';

  constructor(
    private medicalCertificateService: MedicalCertificateService,
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

    if (this.role === 'colaborador') {
      this.canCreate = true;
    }

    this.medicalCertificateService
      .getMedicalCertificates()
      .subscribe((data) => {
        this.medicalCertificates = data;
        this.filteredMedicalCertificates = [...this.medicalCertificates];
        this.isLoading = signal(false);
      });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredMedicalCertificates = this.medicalCertificates.filter(
      (medicalCertificate) =>
        medicalCertificate.status.toLowerCase().includes(term)
    );
  }

  openMedicalCertificate(id: number) {
    this.router.navigate([`/${this.role}/atestado`, id]);
  }

  registerMedicalCertificate() {}

  accept(medicalCertificateId: number) {}

  deleteMedicalCertificate(medicalCertificateId: number) {
    const medicalCertificate = this.medicalCertificates.find(
      (medicalCertificate) => medicalCertificate.id === medicalCertificateId
    );
    if (!medicalCertificate) return;

    this.openDialog
      .confirm({
        title: 'Excluir atestado',
        message: `Tem certeza que deseja excluir o atestado?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(medicalCertificateId);
        }
      });
  }

  private executeDelete(medicalCertificateId: number): void {
    this.isLoading.set(true);

    this.medicalCertificateService
      .deleteMedicalCertificate(medicalCertificateId)
      .subscribe({
        next: () => {
          this.medicalCertificates = this.medicalCertificates.filter(
            (medicalCertificate) =>
              medicalCertificate.id !== medicalCertificateId
          );
          this.applyFilter();
          this.snackbarService.show('Atestado deletado com sucesso');
          this.isLoading.set(false);
        },
        error: (err) => {
          this.snackbarService.show(
            err.error?.message || 'Erro ao deletar atestado'
          );
          this.isLoading.set(false);
        },
      });
  }
}
