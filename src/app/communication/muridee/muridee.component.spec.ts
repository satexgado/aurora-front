import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MurideeComponent } from './muridee.component';

describe('MurideeComponent', () => {
  let component: MurideeComponent;
  let fixture: ComponentFixture<MurideeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MurideeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MurideeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
