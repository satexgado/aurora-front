import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoardingComponent } from './loarding.component';

describe('LoardingComponent', () => {
  let component: LoardingComponent;
  let fixture: ComponentFixture<LoardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
