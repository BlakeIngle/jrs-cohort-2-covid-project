import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRankComponent } from './table-rank.component';

describe('TableRankComponent', () => {
  let component: TableRankComponent;
  let fixture: ComponentFixture<TableRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
