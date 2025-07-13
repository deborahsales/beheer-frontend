import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestacaoContasIdComponent } from './prestacao-contas-id.component';

describe('PrestacaoContasIdComponent', () => {
  let component: PrestacaoContasIdComponent;
  let fixture: ComponentFixture<PrestacaoContasIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestacaoContasIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestacaoContasIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
