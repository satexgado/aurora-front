import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcheancefichierComponent } from './echeancefichier.component';

describe('EcheancefichierComponent', () => {
  let component: EcheancefichierComponent;
  let fixture: ComponentFixture<EcheancefichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcheancefichierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcheancefichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
