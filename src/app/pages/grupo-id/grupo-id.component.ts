import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../core/interfaces/group';
import { GroupService } from '../../core/services/group.service';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-grupo-id',
  imports: [ContainerComponent, InitialsPipe, ProgressSpinnerComponent],
  templateUrl: './grupo-id.component.html',
  styleUrl: './grupo-id.component.scss',
})
export class GrupoIdComponent {
  groupId!: string;
  isLoading = signal(false);
  group!: Group;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.isLoading = signal(true);
    this.groupId = this.route.snapshot.paramMap.get('id')!;

    if (this.groupId) {
      this.groupService.getGroupById(this.groupId).subscribe({
        next: (group) => {
          this.group = group;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  openMember(userId: number) {}
}
