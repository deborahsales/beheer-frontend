import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

export interface SidebarLink {
  label: string;
  icon?: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule, UserAvatarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isSidebarOpen = false;
  constructor(private userService: UserService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @Input() links: SidebarLink[] = [];
  @Output() logout = new EventEmitter<void>();
  userName: string = 'Usuário';
  userEmail: string = '';

  ngOnInit() {
    this.userService
      .getAuthUser()
      .pipe(
        map((user) => {
          return user;
        })
      )
      .subscribe((user) => {
        if (user) {
          this.userName = user.nome;
          this.userEmail = user.email;
        }
      });
  }

  onLogout() {
    this.userService.logout();
    this.logout.emit();
  }
}
