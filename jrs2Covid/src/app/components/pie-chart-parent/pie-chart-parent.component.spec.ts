import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartParentComponent } from './pie-chart-parent.component';

describe('PieChartParentComponent', () => {
  let component: PieChartParentComponent;
  let fixture: ComponentFixture<PieChartParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieChartParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
