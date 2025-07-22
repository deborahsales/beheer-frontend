import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { Attendance } from '../../core/interfaces/attendance';
import { AttendanceService } from '../../core/services/attendance.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-ponto-id',
  imports: [ProgressSpinnerComponent, ContainerComponent, DatePipe],
  templateUrl: './ponto-id.component.html',
  styleUrl: './ponto-id.component.scss',
})
export class PontoIdComponent {
  private map!: L.Map;
  attendanceId!: number;
  userId!: number;
  isLoading = signal(false);
  attendance!: Attendance;
  role: string = 'colaborador';

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.attendanceId = Number(this.route.snapshot.paramMap.get('id')!);

    this.userService.getAuthUser().subscribe((user) => {
      if (user) {
        this.userId = user?.sub || 0;
        this.role = user?.funcao.toLowerCase() || '';
      }
    });

    if (this.attendanceId) {
      this.attendanceService.getAttendanceById(this.attendanceId).subscribe({
        next: (attendance) => {
          this.attendance = attendance;
          this.isLoading.set(false);
          this.initMap();
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  requestAdjustment() {}

  private initMap(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });

    requestAnimationFrame(() => {
      if (this.map) {
        this.map.remove();
      }

      const lat = this.attendance.latitude;
      const lng = this.attendance.longitude;

      if (lat && lng) {
        this.map = L.map('map').setView([lat, lng], 18);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        L.marker([lat, lng]).addTo(this.map);
      }
    });
  }
}
