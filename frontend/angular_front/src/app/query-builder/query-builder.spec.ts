import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryBuilder } from './query-builder';

describe('QueryBuilder', () => {
  let component: QueryBuilder;
  let fixture: ComponentFixture<QueryBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
