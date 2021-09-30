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
  margin = 100;
  width = 750;
  height = 500;
  radius = 250;

  data;


  constructor(private worldService: WorldometersService) { }

  ngOnInit(): void {

    this.worldService.getSCVaccines()
      .subscribe(data => {
        this.data = data
        // console.log(data);
        this.createSvg()
        this.drawLineGraph(data)
      })
  }

  createSvg() {
    this.svg = d3.select(".line-canvas")
      .append("svg")
      .attr("viewBox", [0, 0, this.width, this.height]);
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


  drawLineGraph(data) {


    var vaxData = Object.keys(data.timeline).map(key => {
      return {
        date: new Date(key),
        vaccinations: data.timeline[key]
      }
    });

    var vaxExtent = [vaxData[0].vaccinations, vaxData[vaxData.length - 1].vaccinations];

    var y = d3.scaleLinear()
      .domain(vaxExtent).nice()
      .range([this.height - this.margin, this.margin])

    var x = d3.scaleLinear()
      .domain([vaxData[0].date.getTime(), vaxData[vaxData.length - 1].date.getTime()]).nice()
      .range([this.margin, this.width - this.margin])

    var xAxis = (g) => g
      .attr("transform", `translate(0,${this.height - this.margin})`)
      .call(d3.axisBottom(x)
        .ticks(10)
        .tickFormat(function (d) {
          let time = new Date(d)
          return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
        })
      )
      .selectAll('text')
      .attr("transform", "rotate(-45), translate(-8, -5)")
      .style("text-anchor", "end");

    var yAxis = g => g
      .attr("transform", `translate(${this.margin},0)`)
      .call(d3.axisLeft(y))

    this.svg.append("g")
      .call(xAxis);

    this.svg.append("g")
      .call(yAxis);


    var color = d3.scaleLinear()
      .domain(vaxExtent)
      .range(["#000000", "#000000"])

    this.svg.append("path")
      .datum(vaxData)
      .attr("fill", "none")
      .attr("stroke", 'steelblue')
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", d3.line()
        // .defined(d => !isNaN(d.value))
        .x(d => x(d.date.getTime()))
        .y(d => y(d.vaccinations))
      );
  }
}
