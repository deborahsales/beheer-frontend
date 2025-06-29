import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesHeaderComponent } from './features-header.component';

describe('FeaturesHeaderComponent', () => {
  let component: FeaturesHeaderComponent;
  let fixture: ComponentFixture<FeaturesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
