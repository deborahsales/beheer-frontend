import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesAjusteComponent } from './solicitacoes-ajuste.component';

describe('SolicitacoesAjusteComponent', () => {
  let component: SolicitacoesAjusteComponent;
  let fixture: ComponentFixture<SolicitacoesAjusteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacoesAjusteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesAjusteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
