import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicefichierComponent } from './servicefichier.component';

describe('ServicefichierComponent', () => {
  let component: ServicefichierComponent;
  let fixture: ComponentFixture<ServicefichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicefichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicefichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
