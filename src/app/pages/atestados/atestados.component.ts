import { Component, signal } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-atestados',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
  ],
  templateUrl: './atestados.component.html',
  styleUrl: './atestados.component.scss',
})
export class AtestadosComponent {
  isLoading = signal(false);
  searchInput: string = '';
  canCreate: boolean = true;

  applyFilter() {}

  registerMedicalCertificate() {}
}
