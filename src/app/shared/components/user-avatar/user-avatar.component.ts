import { Component, Input } from '@angular/core';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-user-avatar',
  imports: [InitialsPipe],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent {
  @Input() name: string = '';
}
