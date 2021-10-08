import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { WorldometersService } from 'src/app/services/worldometers.service';
import { RegionData } from 'src/app/models/regionData.model';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() region: RegionData;
  @Input() partial: number;
  @Input() total: number;
  @Input() color: string; // '#ffffff'

  @ViewChild("canvas", { static: false }) canvas: ElementRef;

  value = "cases"

  svg;
  // margin = 50;
  width = 100;
  height = 100;
  outerRadius = 50;
  innerRadius = 30;

  data;

  constructor(private worldService: WorldometersService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.createSvg();
    this.drawChart();
    console.log(this.canvas)
  }

  ngOnChanges() {
    // this.createSvg();
    this.drawChart();
    console.log(this.region)
  }

  createSvg() {
    this.svg = d3.select(this.canvas.nativeElement)
      .append("svg")
      .attr("viewBox", [0, 0, this.width, this.height])
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    this.svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .text((this.partial / this.total * 100).toFixed(1) + "%")
      .attr("font-family", "Arial")
      .style("font-size", 18)

  }

  drawChart() {

    if (!this.region) {
      return;
    }

    this.svg.append('path')
      .attr('d', d3.arc()
        .startAngle(0)
        .endAngle(2 * Math.PI)
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius)
      )
      .attr('fill', "#ddd");

    this.svg.append('path')
      .attr('d', d3.arc()
        .startAngle(0)
        .endAngle((this.partial / this.total) * (2 * Math.PI))
        .innerRadius(this.innerRadius)
        .outerRadius(this.outerRadius)
      )
      .attr('fill', this.color);

    this.svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")

      .attr("font-family", "Arial")
      .style("font-size", 18)
  }
}