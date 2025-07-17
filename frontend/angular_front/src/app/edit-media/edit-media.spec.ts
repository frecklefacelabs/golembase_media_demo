import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedia } from './edit-media';

describe('EditMedia', () => {
  let component: EditMedia;
  let fixture: ComponentFixture<EditMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
