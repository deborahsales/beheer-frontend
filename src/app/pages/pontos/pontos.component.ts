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

    this.attendanceService.getAttendances().subscribe((data) => {
      this.attendances = data;
      this.filteredAttendances = [...this.attendances];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {}

  openAttendance(id: number) {
    this.router.navigate([`/${this.role}/ponto`, id]);
  }

  registerAttendance() {}
}
