import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksKanbanComponent } from './tasks-kanban.component';

describe('TasksKanbanComponent', () => {
  let component: TasksKanbanComponent;
  let fixture: ComponentFixture<TasksKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksKanbanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
