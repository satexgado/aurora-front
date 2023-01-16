import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentactionComponent } from './commentaction.component';

describe('CommentactionComponent', () => {
  let component: CommentactionComponent;
  let fixture: ComponentFixture<CommentactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
