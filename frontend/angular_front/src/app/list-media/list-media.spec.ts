import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMedia } from './list-media';

describe('ListMedia', () => {
  let component: ListMedia;
  let fixture: ComponentFixture<ListMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
