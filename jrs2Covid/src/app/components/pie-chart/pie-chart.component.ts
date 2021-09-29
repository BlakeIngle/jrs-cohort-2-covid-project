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
    this.svg.append("text")
      .attr("text-anchor", "middle")
      .text("South Carolina Covid Cases")
      .style("font-size", 25)
  }

  drawChart() {

    // const pie = d3.pie<any>().value((d: any) => d);

    const total = this.data.population;
    const partial = this.data[this.value]


    // this.svg
    //   .append('path')
    //   .attr('d', d3.arc()
    //     .startAngle(0)
    //     .endAngle(2 * Math.PI)
    //     .innerRadius(this.radius * 0.6)
    //     .outerRadius(this.radius)
    //   )
    //   .attr('fill', "#ddd");

    // this.svg
    //   .append('path')
    //   .attr('d', d3.arc()
    //     .startAngle(0)
    //     .endAngle((partial / total) * (2 * Math.PI))
    //     .innerRadius(this.radius * 0.6)
    //     .outerRadius(this.radius)
    //   )
    //   .attr('fill', "red")

    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function (d) { return d.value; })
    // var data_ready = pie([this.data.cases, this.data.population - this.data.cases])

    var color = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "white", "green"]);

    var data_ready = pie([{ key: "population", value: this.data.population }, { key: "cases", value: this.data.cases }])

    var arc = d3.arc()
      .innerRadius(this.radius * 0.5)         // This is the size of the donut hole
      .outerRadius(this.radius * 0.8)


    var outerArc = d3.arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9)

    this.svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

    this.svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d) {
        var posA = arc.centroid(d)
        var posB = outerArc.centroid(d)

        return [posA, posB]
      })


    this.svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function (d) { return d.data.key })
      .attr('transform', function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] += (midangle < Math.PI ? 10 : -10);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
      })
  }
}