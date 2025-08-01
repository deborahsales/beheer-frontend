import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Task } from '../../core/interfaces/task';
import { TaskComment } from '../../core/interfaces/task-comment';
import { CommentService } from '../../core/services/comment.service';
import { OpenDialogService } from '../../core/services/open-dialog.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { AppDateAdapter } from '../../core/utils/app-date.adapter';
import { MY_DATE_FORMATS } from '../../core/utils/date-format';
import { CommentCardComponent } from '../../shared/components/comment-card/comment-card.component';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { ItemSelectionComponent } from '../../shared/components/item-selection/item-selection.component';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { UserAvatarComponent } from '../../shared/components/user-avatar/user-avatar.component';
import { CapitalizeFirstPipe } from '../../shared/pipes/capitalize-first.pipe';

interface Prioridade {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-demanda-id',
  imports: [
    ContainerComponent,
    ProgressSpinnerComponent,
    UserAvatarComponent,
    CapitalizeFirstPipe,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    CommentCardComponent,
    MatExpansionModule,
  ],
  templateUrl: './demanda-id.component.html',
  styleUrl: './demanda-id.component.scss',
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
})
export class DemandaIdComponent {
  taskId!: number;
  userId!: number;
  isLoading = signal(false);
  isLoadingComment = signal(false);
  canManage: boolean = false;
  role: string = 'colaborador';
  task!: Task;
  isEditing = signal(false);
  isEditingComment = signal(false);
  form: FormGroup;
  commentForm: FormGroup;
  editingCommentId: number | null = null;
  @ViewChild('commentTextarea')
  commentTextarea!: ElementRef<HTMLTextAreaElement>;

  comments: TaskComment[] = [];

  Prioridades: Prioridade[] = [
    { value: 'ALTA', viewValue: 'Alta' },
    { value: 'MEDIA', viewValue: 'Média' },
    { value: 'BAIXA', viewValue: 'Baixa' },
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private taskService: TaskService,
    private commentService: CommentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private openDialog: OpenDialogService
  ) {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      prazo: ['', Validators.required],
      prioridade: ['', Validators.required],
    });
    this.commentForm = this.formBuilder.group({
      conteudo: [''],
    });
  }

  ngOnInit(): void {
    this.isEditingComment.set(false);
    this.isLoading.set(true);

    this.userService
      .getAuthUser()
      .pipe(
        map((user) => {
          this.userId = user?.sub || 0;
          this.role = user?.funcao.toLowerCase() || '';
        })
      )
      .subscribe();

    if (this.role === 'gestor') {
      this.canManage = true;
    }

    this.taskId = Number(this.route.snapshot.paramMap.get('id')!);

    if (this.taskId) {
      this.taskService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          this.task = task;

          this.form.patchValue({
            titulo: task.titulo,
            descricao: task.descricao,
            prazo: task.prazo,
            prioridade: task.prioridade,
          });

          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }

    this.commentService.getCommentByTask(this.taskId).subscribe((data) => {
      this.comments = data.sort(
        (a, b) =>
          new Date(a.dateTimestamp).getTime() -
          new Date(b.dateTimestamp).getTime()
      );
      this.isLoading.set(false);
    });
  }

  updateStatus(status: string) {
    this.isLoading.set(true);
    const taskStatus = { status: status };

    this.taskService.updateTaskStatus(this.taskId, taskStatus).subscribe({
      next: () => {
        this.snackbarService.show('Status alterado com sucesso.');
        this.task.status = status;
        this.isLoading.set(false);
      },
      error: () => {
        this.snackbarService.show('Erro ao alterar status.');
        this.isLoading.set(false);
      },
    });
  }

  edit() {
    this.isEditing.set(true);
  }

  openTimeline(id: number) {
    this.router.navigate([`/${this.role}/cronograma`, id]);
  }

  addAssignes(taskId: number, funcao: string) {
    this.openDialog
      .open<
        ItemSelectionComponent,
        { id: number; funcao: string; title: string; isDialog: boolean },
        number[]
      >(ItemSelectionComponent, {
        id: taskId,
        funcao,
        title: funcao === 'GRUPO-DEMANDA' ? 'Editar grupos' : 'Editar usuários',
        isDialog: true,
      })
      .subscribe((selected) => {
        if (selected && selected.length > 0) {
          this.executeAddNewAssigne(selected, taskId, funcao);
        }
      });
  }

  private executeAddNewAssigne(
    selected: number[],
    taskId: number,
    funcao: string
  ) {
    this.isLoading.set(true);
    let taskData: any = {};

    if (funcao === 'GRUPO-DEMANDA') {
      taskData = { gruposDemanda: selected };
    } else if (funcao === 'COLABORADOR-DEMANDA') {
      taskData = { usuariosDemanda: selected };
    }

    this.taskService.updateTask(taskId, taskData).subscribe({
      next: () => {
        this.snackbarService.show('Dados alterados com sucesso.');
        this.isLoading.set(false);
        this.reloadTask();
      },
      error: () => {
        this.snackbarService.show('Erro ao alterar dados.');
        this.isLoading.set(false);
      },
    });
  }

  private reloadTask() {
    this.isLoading.set(true);

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        task.usuariosDemanda = task.usuariosDemanda.sort((a, b) =>
          a.usuario.nome.localeCompare(b.usuario.nome)
        );

        task.gruposDemanda = task.gruposDemanda.sort((a, b) =>
          a.grupo.nome.localeCompare(b.grupo.nome)
        );

        this.task = task;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackbarService.show('Erro ao recarregar demanda.');
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading.set(true);

      const dadosAtualizados = {
        titulo: this.form.get('titulo')!.value,
        descricao: this.form.get('descricao')!.value,
        prazo: this.form.get('prazo')!.value,
        prioridade: this.form.get('prioridade')!.value,
      };

      if (dadosAtualizados) {
        this.taskService.updateTask(this.task.id, dadosAtualizados).subscribe({
          next: (value) => {
            this.task = {
              ...this.task,
              ...dadosAtualizados,
            };
            this.isLoading.set(false);
            this.snackbarService.show('Demanda editada com sucesso');
            this.isEditing.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.snackbarService.show(
              err.error.message || 'Erro ao editar demanda'
            );
          },
        });
      }
    }
  }

  onSubmitComment() {
    this.isLoadingComment.set(true);

    const payload = {
      ...this.commentForm.value,
      demandaId: this.taskId,
    };

    if (this.isEditingComment() && this.editingCommentId !== null) {
      this.commentService
        .updateComment(this.editingCommentId, payload)
        .subscribe({
          next: (updatedComment) => {
            this.comments = this.comments.map((c) =>
              c.id === this.editingCommentId ? { ...c, ...updatedComment } : c
            );
            this.isLoadingComment.set(false);
            this.snackbarService.show('Comentário atualizado com sucesso');
            this.commentForm.reset();
            this.isEditingComment.set(false);
            this.editingCommentId = null;
          },
          error: (err) => {
            this.isLoadingComment.set(false);
            this.snackbarService.show(
              err.error.message || 'Erro ao criar comentário'
            );
          },
        });
    } else {
      this.commentService.createComment(payload).subscribe({
        next: (newComment) => {
          this.comments.push(newComment);
          this.isLoadingComment.set(false);
          this.snackbarService.show('Comentário criado com sucesso');
          this.commentForm.reset();
        },
        error: (err) => {
          this.isLoadingComment.set(false);
          this.snackbarService.show(
            err.error.message || 'Erro ao criar comentário'
          );
        },
      });
    }
  }

  editComment(commentId: number) {
    this.isEditingComment.set(true);
    this.editingCommentId = commentId;

    const comment = this.comments.find((c) => c.id === commentId);

    if (comment) {
      this.commentForm.patchValue({ conteudo: comment.conteudo });
      setTimeout(() => {
        this.commentTextarea?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        this.commentTextarea?.nativeElement.focus();
      });
    }
  }

  deleteComment(commentId: number) {
    const comment = this.comments.find((u) => u.id === commentId);
    if (!comment) return;

    this.openDialog
      .confirm({
        title: 'Excluir comentário',
        message: `Tem certeza que deseja excluir o comentário?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(commentId);
        }
      });
  }

  private executeDelete(commentId: number): void {
    this.isLoading.set(true);

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter((u) => u.id !== commentId);
        this.snackbarService.show('Comentário deletado com sucesso');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.snackbarService.show(
          err.error?.message || 'Erro ao deletar comentário'
        );
        this.isLoading.set(false);
      },
    });
  }

  onCancel() {
    this.isEditing.set(false);
  }

  openGroup(id: number) {
    this.router.navigate([`/${this.role}/grupo`, id]);
  }

  openUser(userId: number) {
    this.router.navigate([`/${this.role}/usuario`, userId]);
  }

  isAtrasada(prazo: string, status: string): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return (
      new Date(prazo).getTime() < hoje.getTime() && status !== 'FINALIZADA'
    );
  }
}
