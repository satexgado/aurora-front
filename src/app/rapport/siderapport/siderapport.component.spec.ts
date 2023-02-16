import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderapportComponent } from './siderapport.component';

describe('SiderapportComponent', () => {
  let component: SiderapportComponent;
  let fixture: ComponentFixture<SiderapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiderapportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiderapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
