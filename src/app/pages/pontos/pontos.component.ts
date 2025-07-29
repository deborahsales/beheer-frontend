import { CommonModule, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { Attendance } from '../../core/interfaces/attendance';
import { AdjustmentRequestService } from '../../core/services/adjustment-requests.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { AdjustmentRequestFormComponent } from '../../shared/components/adjustment-request-form/adjustment-request-form.component';
import { AttendanceFormComponent } from '../../shared/components/attendance-form/attendance-form.component';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { AppDateAdapter } from '../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../core/utils/date-format';

@Component({
  selector: 'app-pontos',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
    CapitalizeFirstPipe,
    CommonModule,
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pontos.component.html',
  styleUrl: './pontos.component.scss',
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})
export class PontosComponent {
  attendances: Attendance[] = [];
  filteredAttendances: Attendance[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = false;
  canSearch: boolean = true;
  role: string = 'colaborador';
  filterControl = new FormGroup({
    dataAjustada: new FormControl(null),
  });

  filterByDate() {
    const selectedDate = this.filterControl.get('dataAjustada')?.value;

    if (!selectedDate) {
      this.filteredAttendances = [...this.attendances];
      return;
    }

    const formattedSelectedDate = new Date(selectedDate)
      .toISOString()
      .split('T')[0];

    this.filteredAttendances = this.attendances.filter((data) => {
      const itemDate = new Date(data.dateTimestamp).toISOString().split('T')[0];
      return itemDate === formattedSelectedDate;
    });
  }

  reset() {
    this.filterControl.reset();
  }

  constructor(
    private attendanceService: AttendanceService,
    private adjustmentRequestService: AdjustmentRequestService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {
    this.filterControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => this.filterByDate());
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

  registerAttendance() {
    this.openDialog
      .open<AttendanceFormComponent, void, any>(AttendanceFormComponent)
      .subscribe((result) => {
        if (result) {
          this.executeCreateAttendance(result);
        }
      });
  }

  private executeCreateAttendance(data: any) {
    this.isLoading.set(true);

    const formData = new FormData();
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);

    if (data.imagem) {
      formData.append('imagem', data.imagem, data.imagem.name);
    }

    this.attendanceService.createAttendance(formData).subscribe({
      next: (newAttendance) => {
        this.attendances.push(newAttendance);
        this.applyFilter();
        this.isLoading.set(false);
        this.snackbarService.show('Ponto registrado com sucesso');
        this.openAttendance(newAttendance.id);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(
          err.error.message || 'Erro ao registrar ponto'
        );
      },
    });
  }

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
          next: (newAttendance) => {
            this.router.navigate([
              `/${this.role}/solicitacao-ajuste`,
              newAttendance.id,
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
