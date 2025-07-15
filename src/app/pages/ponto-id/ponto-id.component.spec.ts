import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoIdComponent } from './ponto-id.component';

describe('PontoIdComponent', () => {
  let component: PontoIdComponent;
  let fixture: ComponentFixture<PontoIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PontoIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PontoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
