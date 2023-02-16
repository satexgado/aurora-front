import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasecolobsComponent } from './basecolobs.component';

describe('BasecolobsComponent', () => {
  let component: BasecolobsComponent;
  let fixture: ComponentFixture<BasecolobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasecolobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasecolobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
