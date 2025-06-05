import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-default-layout',
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {}
