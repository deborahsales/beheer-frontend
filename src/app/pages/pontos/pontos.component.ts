import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Attendance } from '../../core/interfaces/attendance';
import { AttendanceService } from '../../core/services/attendance.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-pontos',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
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

    if (this.role === 'colaborador' || this.role === 'rh') {
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
