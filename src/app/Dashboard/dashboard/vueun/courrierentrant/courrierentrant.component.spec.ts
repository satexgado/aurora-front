import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierentrantComponent } from './courrierentrant.component';

describe('CourrierentrantComponent', () => {
  let component: CourrierentrantComponent;
  let fixture: ComponentFixture<CourrierentrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourrierentrantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourrierentrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
