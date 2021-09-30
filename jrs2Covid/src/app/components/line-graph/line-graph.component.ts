import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { WorldometersService } from 'src/app/services/worldometers.service';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {

  svg;
  margin = 50;
  width = 750;
  height = 600;
  radius = 250;

  data;

  constructor(private worldService: WorldometersService) { }

  ngOnInit(): void {

    this.worldService.getStatesRanked()
      .subscribe(data => {
        this.data = data;
        console.log(data);
        this.createSvg();
        this.drawChart();
      })
  }

  createSvg() {
    this.svg = d3.select(".line-canvas")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
  }

  drawChart() {
    var x = d3.scaleBand()
      .domain(d3.range(this.data.length))
      .range([this.margin, this.width - this.margin])
      .padding(0.1)

    var maxCases = d3.max(this.data, d => d.cases);

    var y = d3.scaleLinear()
      .domain([0, maxCases]).nice()
      .range([this.height - this.margin, this.margin])

    var color = d3.scaleLinear()
      .domain([0, maxCases])
      .range(["#4444FF", "#FF4444"])

    var xAxis = g => g
      .attr("transform", `translate(0,${this.height - this.margin})`)
      .call(d3.axisBottom(x).tickFormat(i => this.data[i].state).tickSizeOuter(0))

    this.svg.selectAll("bar")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.cases))
      .attr("height", d => y(0) - y(d.cases))
      .attr("width", x.bandwidth())
      .attr('fill', (d) => color(d.cases))
  }
}
