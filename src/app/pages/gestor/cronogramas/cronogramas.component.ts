import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Timeline } from '../../../core/interfaces/timeline';
import { OpenDialogService } from '../../../core/services/open-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { TimelineService } from '../../../core/services/timeline.service';
import { UserService } from '../../../core/services/user.service';
import { ContainerComponent } from '../../../shared/components/container/container.component';
import { FeaturesHeaderComponent } from '../../../shared/components/features-header/features-header.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { TimelineFormComponent } from '../../../shared/components/timeline-form/timeline-form.component';

@Component({
  selector: 'app-cronogramas',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    FeaturesHeaderComponent,
    DatePipe,
  ],
  templateUrl: './cronogramas.component.html',
  styleUrl: './cronogramas.component.scss',
})
export class CronogramasComponent {
  timelines: Timeline[] = [];
  filteredTimelines: Timeline[] = [];
  searchInput: string = '';
  isLoading = signal(false);
  canCreate: boolean = true;
  role: string = 'gestor';

  constructor(
    private timelineService: TimelineService,
    private openDialog: OpenDialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = signal(true);

    this.userService.getRole().subscribe((role) => {
      if (role) {
        this.role = role.toLowerCase();
      }
    });

    this.timelineService.getTimelines().subscribe((data) => {
      this.timelines = data;
      this.filteredTimelines = [...this.timelines];
      this.isLoading = signal(false);
    });
  }

  applyFilter() {
    const term = this.searchInput.toLowerCase();
    this.filteredTimelines = this.timelines.filter(
      (timelines) =>
        timelines.titulo.toLowerCase().includes(term) ||
        timelines.descricao.toLowerCase().includes(term)
    );
  }

  openTimeline(id: number) {
    this.router.navigate([`/${this.role}/cronograma`, id]);
  }

  createTimeline() {
    this.openDialog
      .open<TimelineFormComponent, void, { titulo: string; descricao: string }>(
        TimelineFormComponent
      )
      .subscribe((result) => {
        if (result) {
          this.executeCreate(result);
        }
      });
  }

  private executeCreate(data: { titulo: string; descricao: string }) {
    this.isLoading.set(true);
    this.timelineService.createTimeline(data).subscribe({
      next: (newTimeline) => {
        this.timelines.push(newTimeline);
        this.applyFilter();
        this.isLoading.set(false);
        this.snackbarService.show('Cronograma criado com sucesso');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbarService.show(
          err.error.message || 'Erro ao criar cronograma'
        );
      },
    });
  }

  accept(timelineId: number) {}

  deleteTimeline(timelineId: number) {
    const timeline = this.timelines.find(
      (timeline) => timeline.id === timelineId
    );
    if (!timeline) return;

    this.openDialog
      .confirm({
        title: 'Excluir cronograma',
        message: `Tem certeza que deseja excluir o cronograma?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(timelineId);
        }
      });
  }

  private executeDelete(timelineId: number): void {
    this.isLoading.set(true);

    this.timelineService.deleteTimeline(timelineId).subscribe({
      next: () => {
        this.timelines = this.timelines.filter(
          (timeline) => timeline.id !== timelineId
        );
        this.applyFilter();
        this.snackbarService.show('Cronograma deletado com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar cronograma'
        );
        this.isLoading.set(false);
      },
    });
  }
}
