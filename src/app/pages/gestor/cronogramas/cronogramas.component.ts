import { Component, signal } from '@angular/core';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-cronogramas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
  ],
  templateUrl: './cronogramas.component.html',
  styleUrl: './cronogramas.component.scss',
})
export class CronogramasComponent {
  isLoading = signal(false);
  searchInput: string = '';
  canCreate: boolean = true;

  applyFilter() {}

  createTimeline() {}
}
