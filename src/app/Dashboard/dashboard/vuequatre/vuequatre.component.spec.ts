import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuequatreComponent } from './vuequatre.component';

describe('VuequatreComponent', () => {
  let component: VuequatreComponent;
  let fixture: ComponentFixture<VuequatreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VuequatreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VuequatreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
