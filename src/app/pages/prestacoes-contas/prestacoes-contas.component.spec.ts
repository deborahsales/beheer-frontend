import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestacoesContasComponent } from './prestacoes-contas.component';

describe('PrestacoesContasComponent', () => {
  let component: PrestacoesContasComponent;
  let fixture: ComponentFixture<PrestacoesContasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestacoesContasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestacoesContasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
