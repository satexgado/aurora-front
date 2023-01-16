import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauobjectifComponent } from './tableauobjectif.component';

describe('TableauobjectifComponent', () => {
  let component: TableauobjectifComponent;
  let fixture: ComponentFixture<TableauobjectifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableauobjectifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauobjectifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
