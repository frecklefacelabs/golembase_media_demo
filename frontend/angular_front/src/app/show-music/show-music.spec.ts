import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMusic } from './show-music';

describe('ShowMusic', () => {
  let component: ShowMusic;
  let fixture: ComponentFixture<ShowMusic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMusic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMusic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
