import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { MedicalCertificate } from '../../core/interfaces/medical-certificate';
import { MedicalCertificateService } from '../../core/services/medical-certificate.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { MedicalCertificateFormComponent } from '../../shared/components/medical-certificate-form/medical-certificate-form.component';
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
    MatButtonToggleModule,
    ReactiveFormsModule,
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
  canSearch: boolean = true;
  role: string = 'colaborador';

  statusFilterControl = new FormControl('');
  statusFilter?: string;

  filterByStatus(status: string) {
    if (!status) {
      this.filteredMedicalCertificates = [...this.medicalCertificates];
      return;
    }

    const statusLower = status.toLowerCase();

    this.filteredMedicalCertificates = this.medicalCertificates.filter((data) =>
      data.status.toLowerCase().includes(statusLower)
    );
  }

  reset() {
    this.statusFilterControl.setValue('');
  }

  constructor(
    private medicalCertificateService: MedicalCertificateService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {
    this.statusFilterControl.valueChanges.subscribe((value) => {
      const safeValue = value ?? '';
      this.statusFilter = safeValue;
      this.filterByStatus(safeValue);
    });
  }

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    if (this.role === 'colaborador' || this.role === 'gestor') {
      this.canCreate = true;
      this.canSearch = false;
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
        medicalCertificate.status.toLowerCase().includes(term) ||
        medicalCertificate.usuario.nome.toLowerCase().includes(term) ||
        medicalCertificate.diaInteiro
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(
            term
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
          )
    );
  }

  openMedicalCertificate(id: number) {
    this.router.navigate([`/${this.role}/atestado`, id]);
  }

  registerMedicalCertificate() {
    this.openDialog
      .open<MedicalCertificateFormComponent, void, any>(
        MedicalCertificateFormComponent
      )
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: any) {
    this.isLoading.set(true);

    const formData = new FormData();
    formData.append('dataAtestado', new Date(data.dataAtestado).toISOString());
    formData.append('diaInteiro', data.diaInteiro);

    if (data.diaInteiro === 'SIM') {
      formData.append('horaInicio', 'null');
      formData.append('horaTermino', 'null');
    } else {
      if (data.horaInicio) {
        const [sHours, sMinutes] = data.horaInicio.split(':');
        const combinedDatehoraInicio = new Date(data.dataAtestado);
        combinedDatehoraInicio.setHours(+sHours, +sMinutes, 0, 0);
        formData.append('horaInicio', combinedDatehoraInicio.toISOString());
      }

      if (data.horaTermino) {
        const [sHours, sMinutes] = data.horaTermino.split(':');
        const combinedDatehoraTermino = new Date(data.dataAtestado);
        combinedDatehoraTermino.setHours(+sHours, +sMinutes, 0, 0);
        formData.append('horaTermino', combinedDatehoraTermino.toISOString());
      }
    }

    if (data.imagemFile) {
      formData.append('imagem', data.imagemFile, data.imagemFile.name);
    }

    this.medicalCertificateService
      .createMedicalCertificate(formData)
      .subscribe({
        next: (newMedicalCertificate) => {
          this.medicalCertificates.push(newMedicalCertificate);
          this.applyFilter();
          this.isLoading.set(false);
          this.snackbarService.show('Atestado cadastrado com sucesso');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackbarService.show(
            err.error.message || 'Erro ao cadastrar atestado'
          );
        },
      });
  }

  manageRequest(medicalCertificateId: number, manage: boolean) {
    this.isLoading.set(true);
    const status = manage ? 'ACEITE' : 'RECUSADO';
    const medicalCertificate = { status };

    this.medicalCertificateService
      .manageMedicalCertificate(medicalCertificateId, medicalCertificate)
      .subscribe({
        next: () => {
          const medicalCertificate = this.medicalCertificates.find(
            (n) => n.id === medicalCertificateId
          );
          if (medicalCertificate) {
            medicalCertificate.status = status;
          }
          this.snackbarService.show('Status alterado com sucesso.');
          this.isLoading.set(false);
        },
        error: () => {
          this.snackbarService.show('Erro ao alterar status.');
          this.isLoading.set(false);
        },
      });
  }

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
