import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoIdComponent } from './grupo-id.component';

describe('GrupoIdComponent', () => {
  let component: GrupoIdComponent;
  let fixture: ComponentFixture<GrupoIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
