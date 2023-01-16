import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasevueunComponent } from './basevueun.component';

describe('BasevueunComponent', () => {
  let component: BasevueunComponent;
  let fixture: ComponentFixture<BasevueunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasevueunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasevueunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
