import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotclefichierComponent } from './motclefichier.component';

describe('MotclefichierComponent', () => {
  let component: MotclefichierComponent;
  let fixture: ComponentFixture<MotclefichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotclefichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotclefichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
