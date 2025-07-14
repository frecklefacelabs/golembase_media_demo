import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBook } from './show-book';

describe('ShowBook', () => {
  let component: ShowBook;
  let fixture: ComponentFixture<ShowBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
