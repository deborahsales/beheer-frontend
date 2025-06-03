import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaAvisosComponent } from './gerencia-avisos.component';

describe('GerenciaAvisosComponent', () => {
  let component: GerenciaAvisosComponent;
  let fixture: ComponentFixture<GerenciaAvisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaAvisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaAvisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
