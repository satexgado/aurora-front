import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VuetroisComponent } from './vuetrois.component';

describe('VuetroisComponent', () => {
  let component: VuetroisComponent;
  let fixture: ComponentFixture<VuetroisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VuetroisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VuetroisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
