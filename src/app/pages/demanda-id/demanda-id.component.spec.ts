import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandaIdComponent } from './demanda-id.component';

describe('DemandaIdComponent', () => {
  let component: DemandaIdComponent;
  let fixture: ComponentFixture<DemandaIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandaIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandaIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
