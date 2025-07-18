import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskComment } from '../../../core/interfaces/task-comment';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-comment-card',
  imports: [DatePipe, UserAvatarComponent, CommonModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent {
  @Input() comment!: TaskComment;
  @Input() userId!: number;
  @Output() deleteComment = new EventEmitter<void>();
  @Output() editComment = new EventEmitter<void>();
  @Output() openUser = new EventEmitter<void>();

  onDelete() {
    return this.deleteComment.emit();
  }

  onEdit() {
    return this.editComment.emit();
  }

  onOpenUser() {
    return this.openUser.emit();
  }
}
