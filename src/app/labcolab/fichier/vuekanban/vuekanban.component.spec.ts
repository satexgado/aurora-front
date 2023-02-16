import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuekanbanComponent } from './vuekanban.component';

describe('VuekanbanComponent', () => {
  let component: VuekanbanComponent;
  let fixture: ComponentFixture<VuekanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VuekanbanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VuekanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
