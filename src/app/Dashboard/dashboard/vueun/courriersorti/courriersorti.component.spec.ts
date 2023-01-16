import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourriersortiComponent } from './courriersorti.component';

describe('CourriersortiComponent', () => {
  let component: CourriersortiComponent;
  let fixture: ComponentFixture<CourriersortiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourriersortiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourriersortiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
