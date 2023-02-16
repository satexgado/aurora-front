import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysidefichierComponent } from './mysidefichier.component';

describe('MysidefichierComponent', () => {
  let component: MysidefichierComponent;
  let fixture: ComponentFixture<MysidefichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MysidefichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysidefichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
