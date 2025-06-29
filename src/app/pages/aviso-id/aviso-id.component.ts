import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../core/interfaces/notification';
import { NotificationService } from '../../core/services/notification.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-aviso-id',
  imports: [ProgressSpinnerComponent, ContainerComponent, DatePipe],
  templateUrl: './aviso-id.component.html',
  styleUrl: './aviso-id.component.scss',
})
export class AvisoIdComponent {
  notificationId!: number;
  isLoading = signal(false);
  notification!: Notification;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.notificationId = Number(this.route.snapshot.paramMap.get('id')!);

    if (this.notificationId) {
      this.notificationService
        .getNotificationById(this.notificationId)
        .subscribe({
          next: (notification) => {
            this.notification = notification;
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          },
        });
    }
  }
}
