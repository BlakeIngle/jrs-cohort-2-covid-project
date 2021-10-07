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
  yAxisValue: 'totalCases' | 'totalDeaths' = "totalCases"

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
    this.svg.append('rect')
      .attr('width', this.width - this.margin * 2)
      .attr('height', this.height - this.margin * 2)
      .attr('x', this.margin)
      .attr('y', this.margin)
      .attr('class', 'graph-content')
      .attr('fill', this.yAxisValue == 'totalCases' ? '#dbf3fa' : '#ffeded')
  }

  drawLineGraph() {
    if (!this.regions || this.regions.length <= 0 || this.regions[0] == null) {
      return;
    }

    let line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date.getTime()))
      .y(d => y(d.value))

    let cases = this.regions[0].timeline.cases
    let maxDate = cases[cases.length - 1].date.getTime();
    let minDate = cases[0].date.getTime();

    let xDomain = []
    for (let date of this.regions[0].timeline.cases) {
      xDomain.push(date.date);
    }

    // make x Scale
    let x = d3.scaleUtc()
      .domain([minDate, maxDate])
      .range([this.margin, this.width - this.margin])

    let y = this.makeYScale();

    let tickLabels = [minDate, maxDate]

    let xAxis = g => g
      .attr("transform", `translate(0,${this.height - this.margin})`)
      .call(d3.axisBottom(x)
        // .ticks(10)
        .tickFormat(xDomain.length > 100 ?
          this.monthYearFormat : this.dayMonthFormat)
        // use month/year
        // .ticks(tickLabels.length)
        .tickSizeOuter(0)
      )

    let yAxis = g => g
      .attr("transform", `translate(${this.margin},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", -90)
        .attr("y", 140)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(this.yAxisValue == 'totalCases' ? 'Cases' : 'Deaths')
      );

    this.svg.append("g")
      .call(xAxis);

    this.svg.append("g")
      .call(yAxis);

    let regions = this.svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(this.regions);

    if (this.yAxisValue == 'totalCases') {
      regions
        .join("path")
        .attr("stroke", "steelblue")
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.timeline.cases)
        );
    } else {
      regions
        .join("path")
        .attr("stroke", "red")
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.timeline.deaths)
        );
    }

  }

  monthYearFormat(d) {
    return d3.timeFormat("%b %Y")(d);
  }

  dayMonthFormat(d) {
    return d3.timeFormat("%b %d")(d);
  }

  makeYScale() {
    let domain;
    if (this.yAxisValue == 'totalCases') {
      let maxCases = d3.max(this.regions, r => r.totalCases)
      let minCases = d3.min(this.regions, r => r.timeline.cases[0].value)
      domain = [minCases, maxCases]
    } else {
      let maxDeaths = d3.max(this.regions, r => r.totalDeaths)
      let minDeaths = d3.min(this.regions, r => r.timeline.deaths[0].value)
      domain = [minDeaths, maxDeaths]
    }

    return d3.scaleLinear()
      .domain(domain)
      .nice()
      .range([this.height - this.margin, this.margin])
  }

  changeYAxis() {
    this.svg.remove();
    this.createSvg();
    this.drawLineGraph();
  }

}