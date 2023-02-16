import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidefichierComponent } from './sidefichier.component';

describe('SidefichierComponent', () => {
  let component: SidefichierComponent;
  let fixture: ComponentFixture<SidefichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidefichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidefichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
