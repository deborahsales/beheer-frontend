import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { Attendance } from '../../core/interfaces/attendance';
import { AdjustmentRequestService } from '../../core/services/adjustment-requests.service';
import { AttendanceService } from '../../core/services/attendance.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { UserService } from '../../core/services/user.service';
import { AdjustmentRequestFormComponent } from '../../shared/components/adjustment-request-form/adjustment-request-form.component';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

@Component({
  selector: 'app-ponto-id',
  imports: [
    ProgressSpinnerComponent,
    ContainerComponent,
    DatePipe,
    CapitalizeFirstPipe,
  ],
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
    private adjustmentRequestService: AdjustmentRequestService,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private openDialog: OpenDialogService,
    private router: Router
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

  openAdjustmentRequest(id: number) {
    this.router.navigate([`/${this.role}/solicitacao-ajuste`, id]);
  }

  requestAdjustment() {
    this.openDialog
      .open<AdjustmentRequestFormComponent, void, any>(
        AdjustmentRequestFormComponent
      )
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: any) {
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
        .createAdjustmentRequest(this.attendanceId, dadosAtualizados)
        .subscribe({
          next: (newReport) => {
            this.openAdjustmentRequest(newReport.id);
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
