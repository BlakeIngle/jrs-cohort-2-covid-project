import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { RegionData } from 'src/app/models/regionData.model';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {

  @Input() regions: RegionData[];

  @Output() timePeriodChange = new EventEmitter<number>();

  @ViewChild("canvas", { static: false }) canvas: ElementRef;

  days = [
    { label: "One Week", value: 7 },
    { label: "One Month", value: 31 },
    { label: "Three Months", value: 93 },
    { label: "Six Months", value: 183 },
    { label: "One Year", value: 365 },
  ];

  activeTimePeriod: number = 7;

  svg;
  margin = {
    top: 30,
    right: 30,
    left: 75,
    bottom: 30
  };
  width = 750;
  height = 450;
  radius = 250;

  yAxisValue: 'totalCases' | 'totalDeaths' = "totalCases"

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.resetGraph();
    if (this.regions && this.regions[0]?.timeline?.cases) {
      this.activeTimePeriod = this.regions[0].timeline.cases.length;
    }
  }

  createSvg() {
    if (!this.canvas) {
      return
    }

    this.svg = d3.select(this.canvas.nativeElement)
      .append("svg")
      .attr("viewBox", [0, 0, this.width, this.height]);
  }

  drawLineGraph() {
    if (!this.regions || this.regions.length <= 0
      || this.regions[0] == null) {
      return;
    }

    if (!this.svg) {
      return
    }

    this.svg.append('rect')
      .attr('width', this.width - (this.margin.left + this.margin.right))
      .attr('height', this.height - (this.margin.top + this.margin.bottom))
      .attr('x', this.margin.left)
      .attr('y', this.margin.top)
      .attr('class', 'graph-content')
      .attr('fill', this.yAxisValue == 'totalCases' ? '#dbf3fa' : '#ffeded')

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
      // .nice() // TODO: make this work
      .range([this.margin.left, this.width - this.margin.right])

    let y = this.makeYScale();

    let tickLabels = [minDate, maxDate]

    let xAxis = g => g
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(x)
        // .ticks(10)
        .tickFormat(xDomain.length > 100 ?
          this.monthYearFormat : this.dayMonthFormat)
        // use month/year
        // .ticks(tickLabels.length)
        .tickSizeOuter(0)
      )

    let yAxis = g => g
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("text-anchor", "middle")
        .attr("y", "0")
        .attr("x", "0")
        .attr("font-weight", "bold")
        .attr("font-size", "16")
        .attr("transform", "translate(" + (8 - this.margin.left) + "," + ((this.height - (this.margin.top + this.margin.bottom)) / 2) + ")rotate(-90)")
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
    //%b : 01 -> Jan
  }

  dayMonthFormat(d) {
    return d3.timeFormat("%b %d")(d);
  }

  makeYScale() {
    let domain;
    let min;
    let max;
    if (this.yAxisValue == 'totalCases') {
      max = d3.max(this.regions, r => r.totalCases)
      min = d3.min(this.regions, r => r.timeline.cases[0].value)
    } else {
      max = d3.max(this.regions, r => r.totalDeaths)
      min = d3.min(this.regions, r => r.timeline.deaths[0].value)
    }

    if (max - min < 9) {
      min -= 1;
      max += 7;
    }

    domain = [min, max]

    return d3.scaleLinear()
      .domain(domain)
      .nice()
      .range([this.height - this.margin.bottom, this.margin.top])
  }

  getDay() {
    this.timePeriodChange.emit(this.activeTimePeriod)
  }

  resetGraph() {
    if (!this.svg) {
      this.createSvg();
    } else {
      this.svg.selectAll("*").remove();
    }
    this.drawLineGraph();
  }

}