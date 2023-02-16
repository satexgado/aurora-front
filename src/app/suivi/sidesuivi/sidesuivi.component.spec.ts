import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidesuiviComponent } from './sidesuivi.component';

describe('SidesuiviComponent', () => {
  let component: SidesuiviComponent;
  let fixture: ComponentFixture<SidesuiviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidesuiviComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidesuiviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
