import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-user-avatar',
  imports: [InitialsPipe, CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent {
  @Input() name: string = '';
  @Input() size = '30px';
  @Input() fontSize = '14px';
  @Input() colorOrange = false;
  @Input() hover = false;

  @Output() avatarClick = new EventEmitter<void>();

  onClick() {
    return this.avatarClick.emit();
  }
}
