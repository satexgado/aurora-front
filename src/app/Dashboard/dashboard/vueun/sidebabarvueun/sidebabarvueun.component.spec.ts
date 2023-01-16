import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebabarvueunComponent } from './sidebabarvueun.component';

describe('SidebabarvueunComponent', () => {
  let component: SidebabarvueunComponent;
  let fixture: ComponentFixture<SidebabarvueunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebabarvueunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebabarvueunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
