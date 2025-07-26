import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportFormComponent } from './financial-report-form.component';

describe('FinancialReportFormComponent', () => {
  let component: FinancialReportFormComponent;
  let fixture: ComponentFixture<FinancialReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialReportFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
