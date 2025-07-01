import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioIdComponent } from './usuario-id.component';

describe('UsuarioIdComponent', () => {
  let component: UsuarioIdComponent;
  let fixture: ComponentFixture<UsuarioIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
