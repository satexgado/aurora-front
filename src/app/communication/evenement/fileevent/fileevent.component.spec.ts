import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileeventComponent } from './fileevent.component';

describe('FileeventComponent', () => {
  let component: FileeventComponent;
  let fixture: ComponentFixture<FileeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileeventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
