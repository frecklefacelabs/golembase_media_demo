import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookDetails } from './edit-book-details';

describe('EditBookDetails', () => {
  let component: EditBookDetails;
  let fixture: ComponentFixture<EditBookDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBookDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBookDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
