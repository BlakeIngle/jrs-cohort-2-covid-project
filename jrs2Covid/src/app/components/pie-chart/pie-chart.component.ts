import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { WorldometersService } from 'src/app/services/worldometers.service';

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  value = "cases"

  svg;
  margin = 50;
  width = 750;
  height = 600;
  radius = 250;

  data;

  constructor(private worldService: WorldometersService) { }

  ngOnInit(): void {
    this.worldService.getSCNumbers()
      .subscribe(data => {
        this.data = data;
        console.log(data);
        this.createSvg();
        this.drawChart();
      })
    // this.data = [10, 20, 30, 40, 40]
  }

  createSvg() {
    this.svg = d3.select("#canvas")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")
  }

  drawChart() {
    const pie = d3.pie<any>().value((d: any) => d);

    const total = this.data.population;
    const partial = this.data[this.value]


    this.svg
      .append('path')
      .attr('d', d3.arc()
        .startAngle(0)
        .endAngle(2 * Math.PI)
        .innerRadius(this.radius * 0.6)
        .outerRadius(this.radius)
      )
      .attr('fill', "#ddd");

    this.svg
      .append('path')
      .attr('d', d3.arc()
        .startAngle(0)
        .endAngle((partial / total) * (2 * Math.PI))
        .innerRadius(this.radius * 0.6)
        .outerRadius(this.radius)
      )
      .attr('fill', "#1177dd");

  }
}
