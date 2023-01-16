import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuedeuxComponent } from './vuedeux.component';

describe('VuedeuxComponent', () => {
  let component: VuedeuxComponent;
  let fixture: ComponentFixture<VuedeuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VuedeuxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VuedeuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
