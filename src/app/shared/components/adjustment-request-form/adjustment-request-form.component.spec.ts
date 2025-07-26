import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentRequestFormComponent } from './adjustment-request-form.component';

describe('AdjustmentRequestFormComponent', () => {
  let component: AdjustmentRequestFormComponent;
  let fixture: ComponentFixture<AdjustmentRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustmentRequestFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
