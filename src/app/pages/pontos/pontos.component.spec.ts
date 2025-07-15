import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PontosComponent } from './pontos.component';

describe('PontosComponent', () => {
  let component: PontosComponent;
  let fixture: ComponentFixture<PontosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PontosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
