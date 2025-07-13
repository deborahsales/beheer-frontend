import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtestadoIdComponent } from './atestado-id.component';

describe('AtestadoIdComponent', () => {
  let component: AtestadoIdComponent;
  let fixture: ComponentFixture<AtestadoIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtestadoIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtestadoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
