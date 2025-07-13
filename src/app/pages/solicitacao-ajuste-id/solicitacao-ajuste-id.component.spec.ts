import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoAjusteIdComponent } from './solicitacao-ajuste-id.component';

describe('SolicitacaoAjusteIdComponent', () => {
  let component: SolicitacaoAjusteIdComponent;
  let fixture: ComponentFixture<SolicitacaoAjusteIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacaoAjusteIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoAjusteIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
