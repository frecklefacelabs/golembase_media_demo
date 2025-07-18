import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMediaDetails } from './show-media-details';

describe('ShowMediaDetails', () => {
  let component: ShowMediaDetails;
  let fixture: ComponentFixture<ShowMediaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMediaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMediaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
