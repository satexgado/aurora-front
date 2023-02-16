import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemodellabComponent } from './sidemodellab.component';

describe('SidemodellabComponent', () => {
  let component: SidemodellabComponent;
  let fixture: ComponentFixture<SidemodellabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidemodellabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidemodellabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
