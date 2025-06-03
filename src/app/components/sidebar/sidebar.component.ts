import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';

export interface SidebarLink {
  label: string;
  icon?: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule],
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

  ngOnInit() {
    this.userService.retornaNome().subscribe((nome) => {
      if (nome) {
        this.userName = nome;
      }
    });
  }

  onLogout() {
    this.userService.logout();
    this.logout.emit();
  }
}
