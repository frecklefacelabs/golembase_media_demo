import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBookDetails } from './show-book-details';

describe('ShowBookDetails', () => {
  let component: ShowBookDetails;
  let fixture: ComponentFixture<ShowBookDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBookDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBookDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
