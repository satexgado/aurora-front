import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidelabcolabComponent } from './sidelabcolab.component';

describe('SidelabcolabComponent', () => {
  let component: SidelabcolabComponent;
  let fixture: ComponentFixture<SidelabcolabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidelabcolabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidelabcolabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
