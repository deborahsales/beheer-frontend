import { Component, signal } from '@angular/core';
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
  isLoading = signal(false);
  searchInput: string = '';
  canCreate: boolean = true;

  applyFilter() {}

  registerAttendance() {}
}
