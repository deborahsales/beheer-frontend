import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  sidebarLinks = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.data.subscribe((data) => {
      this.sidebarLinks = data['sidebarLinks'] || [];
    });
  }

  onLogout() {
    this.router.navigate(['/']);
  }
}
