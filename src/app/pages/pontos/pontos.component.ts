import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Attendance } from '../../core/interfaces/attendance';
import { AdjustmentRequestService } from '../../core/services/adjustment-requests.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { AdjustmentRequestFormComponent } from '../../shared/components/adjustment-request-form/adjustment-request-form.component';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-pontos',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
    CapitalizeFirstPipe,
    CommonModule,
  ],
  templateUrl: './pontos.component.html',
  styleUrl: './pontos.component.scss',
})
export class PontosComponent {
  attendances: Attendance[] = [];
  filteredAttendances: Attendance[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = false;
  role: string = 'colaborador';

  constructor(
    private attendanceService: AttendanceService,
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

    if (this.role === 'colaborador' || this.role === 'gestor') {
      this.canCreate = true;
    }

    this.attendanceService.getAttendances().subscribe((data) => {
      this.attendances = data;
      this.filteredAttendances = [...this.attendances];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredAttendances = this.attendances.filter((attendance) =>
      attendance.usuario.nome.toLowerCase().includes(term)
    );
  }

  openAttendance(id: number) {
    this.router.navigate([`/${this.role}/ponto`, id]);
  }

  registerAttendance() {}

  requestAdjustment(attendanceId: number) {
    this.openDialog
      .open<AdjustmentRequestFormComponent, void, any>(
        AdjustmentRequestFormComponent
      )
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result, attendanceId);
        }
      });
  }

  private executeCreate(data: any, attendanceId: number) {
    this.isLoading.set(true);

    const { dataAjustada, horaAjustada, motivo } = data;

    const dadosAtualizados: any = {
      motivo: motivo,
    };

    if (dataAjustada && horaAjustada) {
      const [hours, minutes] = horaAjustada.split(':');
      const combinedDate = new Date(dataAjustada);
      combinedDate.setHours(+hours, +minutes, 0, 0);

      const isoString = combinedDate.toISOString();

      dadosAtualizados.dateTimestampAjustado = isoString;
    }

    if (dadosAtualizados) {
      this.adjustmentRequestService
        .createAdjustmentRequest(attendanceId, dadosAtualizados)
        .subscribe({
          next: (newReport) => {
            this.router.navigate([
              `/${this.role}/solicitacao-ajuste`,
              newReport.id,
            ]);
            this.isLoading.set(false);
            this.snackbarService.show(
              'Solicitação de ajuste criada com sucesso'
            );
          },
          error: (err) => {
            this.isLoading.set(false);
            this.snackbarService.show(
              err.error.message || 'Erro ao criar solicitação de ajuste'
            );
          },
        });
    }
  }

  deleteAttendance(attendanceId: number) {
    const attendance = this.attendances.find(
      (attendance) => attendance.id === attendanceId
    );
    if (!attendance) return;

    this.openDialog
      .confirm({
        title: 'Excluir ponto',
        message: `Tem certeza que deseja excluir o registro de ponto?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(attendanceId);
        }
      });
  }

  private executeDelete(attendanceId: number): void {
    this.isLoading.set(true);

    this.attendanceService.deleteAttendance(attendanceId).subscribe({
      next: () => {
        this.attendances = this.attendances.filter(
          (attendance) => attendance.id !== attendanceId
        );
        this.applyFilter();
        this.snackbarService.show('Registro de ponto deletado com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar registro de ponto'
        );
        this.isLoading.set(false);
      },
    });
  }
}
