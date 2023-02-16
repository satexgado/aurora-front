import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidexfileComponent } from './sidexfile.component';

describe('SidexfileComponent', () => {
  let component: SidexfileComponent;
  let fixture: ComponentFixture<SidexfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidexfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidexfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
