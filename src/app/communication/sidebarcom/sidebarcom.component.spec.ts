import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarcomComponent } from './sidebarcom.component';

describe('SidebarcomComponent', () => {
  let component: SidebarcomComponent;
  let fixture: ComponentFixture<SidebarcomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarcomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
