import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatToolbarModule, ContainerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
