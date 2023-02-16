import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuearbreComponent } from './vuearbre.component';

describe('VuearbreComponent', () => {
  let component: VuearbreComponent;
  let fixture: ComponentFixture<VuearbreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VuearbreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VuearbreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
