import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Notification } from '../../core/interfaces/notification';
import { NotificationService } from '../../core/services/notification.service';
import { UserService } from '../../core/services/user.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-aviso-id',
  imports: [
    ProgressSpinnerComponent,
    ContainerComponent,
    DatePipe,
    MatExpansionModule,
  ],
  templateUrl: './aviso-id.component.html',
  styleUrl: './aviso-id.component.scss',
})
export class AvisoIdComponent {
  notificationId!: number;
  isLoading = signal(false);
  notification!: Notification;
  userId!: number;
  readonly panelOpenState = signal(false);

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this.notificationId = Number(this.route.snapshot.paramMap.get('id')!);

    this.userService
      .getAuthUser()
      .pipe(
        map((user) => {
          this.userId = user?.sub || 0;
        })
      )
      .subscribe();

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
