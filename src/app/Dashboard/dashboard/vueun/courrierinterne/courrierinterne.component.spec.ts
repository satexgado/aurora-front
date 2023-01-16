import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierinterneComponent } from './courrierinterne.component';

describe('CourrierinterneComponent', () => {
  let component: CourrierinterneComponent;
  let fixture: ComponentFixture<CourrierinterneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourrierinterneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourrierinterneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
