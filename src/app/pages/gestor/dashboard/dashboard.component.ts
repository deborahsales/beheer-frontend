import { Component } from '@angular/core';
import { ConstructionComponent } from '../../../components/construction/construction.component';

@Component({
  selector: 'app-gestor-dashboard',
  imports: [ConstructionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class GestorDashboardComponent {}
