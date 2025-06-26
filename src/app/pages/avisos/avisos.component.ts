import { Component, signal } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-avisos',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
  ],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.scss',
})
export class AvisosComponent {
  isLoading = signal(false);
  searchInput: string = '';
  canCreate: boolean = true;

  applyFilter() {}
  createNotification() {}
}
