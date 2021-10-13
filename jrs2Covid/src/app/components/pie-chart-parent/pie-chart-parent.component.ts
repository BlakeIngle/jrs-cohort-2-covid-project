import { Component, OnInit, Input } from '@angular/core';
import { RegionData } from 'src/app/models/regionData.model';

@Component({
  selector: 'pie-chart-parent',
  templateUrl: './pie-chart-parent.component.html',
  styleUrls: ['./pie-chart-parent.component.css']
})
export class PieChartParentComponent implements OnInit {

  @Input() region: RegionData;

  constructor() { }

  ngOnInit(): void {
  }

}
