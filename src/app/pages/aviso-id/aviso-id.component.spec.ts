import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoIdComponent } from './aviso-id.component';

describe('AvisoIdComponent', () => {
  let component: AvisoIdComponent;
  let fixture: ComponentFixture<AvisoIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisoIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
