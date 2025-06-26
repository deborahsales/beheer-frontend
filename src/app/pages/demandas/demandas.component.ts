import { Component, signal } from '@angular/core';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-demandas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
  ],
  templateUrl: './demandas.component.html',
  styleUrl: './demandas.component.scss',
})
export class DemandasComponent {
  isLoading = signal(false);
  searchInput: string = '';
  canCreate: boolean = true;

  applyFilter() {}

  createTask() {}
}
