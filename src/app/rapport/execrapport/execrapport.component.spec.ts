import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecrapportComponent } from './execrapport.component';

describe('ExecrapportComponent', () => {
  let component: ExecrapportComponent;
  let fixture: ComponentFixture<ExecrapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecrapportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecrapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
