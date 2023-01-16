import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueildashComponent } from './accueildash.component';

describe('AccueildashComponent', () => {
  let component: AccueildashComponent;
  let fixture: ComponentFixture<AccueildashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccueildashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueildashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
