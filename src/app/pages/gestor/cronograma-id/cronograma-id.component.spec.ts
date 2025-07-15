import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramaIdComponent } from './cronograma-id.component';

describe('CronogramaIdComponent', () => {
  let component: CronogramaIdComponent;
  let fixture: ComponentFixture<CronogramaIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronogramaIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronogramaIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
