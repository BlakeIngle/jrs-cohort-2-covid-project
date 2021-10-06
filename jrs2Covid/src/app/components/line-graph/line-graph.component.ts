import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { RegionData } from 'src/app/models/regionData.model';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {

  @Input() regions: RegionData[];

  svg;
  margin = 100;
  width = 750;
  height = 500;
  radius = 250;

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawLineGraph();
  }

  ngOnChanges() {
    this.drawLineGraph();
  }

  createSvg() {
    this.svg = d3.select(".line-canvas")
      .append("svg")
      .attr("viewBox", [0, 0, this.width, this.height]);
  }

  drawLineGraph() {
    if (!this.regions || this.regions.length <= 0 || this.regions[0] == null) {
      return;
    }

    console.log("its working")
    console.log(this.regions)

    let line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date.getTime()))
      .y(d => y(d.value))


    let cases = this.regions[0].timeline.cases
    let minDate = cases[cases.length - 1].date.getTime();
    let maxDate = cases[0].date.getTime();


    let x = d3.scaleLinear()
      .domain([minDate, maxDate])
      .range([this.margin, this.width - this.margin])

    let maxCases = d3.max(this.regions, r => r.totalCases)
    let minCases = d3.min(this.regions, r => r.timeline.cases[0].value)
    let minDeaths = d3.min(this.regions, r => r.timeline.deaths[0].value)

    console.log("x domain: ", [minDate, maxDate])
    console.log("x range: ", [this.margin, this.width - this.margin])

    let y = d3.scaleLinear()
      .domain([d3.min([minCases, minDeaths]), maxCases])
      .nice()
      .range([this.margin, this.height - this.margin])

    let regions = this.svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(this.regions);
    regions
      .join("path")
      .attr("stroke", "steelblue")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.timeline.cases));

    regions.join("path")
    .attr("stroke", "red")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.timeline.deaths));

  }
}
