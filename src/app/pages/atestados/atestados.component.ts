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

@Component({
  selector: 'app-atestados',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
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
}
