import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { WorldometersService } from 'src/app/services/worldometers.service';


/**
 * A choropleth map is a type of thematic map in which a set of
 * pre-defined areas is colored or patterned in proportion to a 
 * statistical variable that represents an aggregate summary of a 
 * geographic characteristic within each area, such as population 
 * density or per-capita income.
 * 
 * This version is for counties of the United States.
 */
@Component({
  selector: 'app-choropleth',
  templateUrl: './choropleth.component.html',
  styleUrls: ['./choropleth.component.css']
})
export class ChoroplethComponent implements OnInit {
  data: Object;
  svg: any;
  margin = 80;
  width = 600;
  height = 400;

  constructor(private worldService: WorldometersService) { }

  ngOnInit(): void {

    this.worldService.getUSACountyNumbers()
      .subscribe(data => {
        this.data = data;

        console.log(data);

        this.createSvg();
        this.drawMap();
      })
  }

  createSvg() {
    this.svg = d3.select(".map-canvas")
      .append("svg")
      .attr("width", this.width + this.margin + this.margin)
      .attr("height", this.height + this.margin + this.margin)
      .append("g")
      .attr("transform",
        "translate(" + this.margin + "," + this.margin + ")");

  }

  drawMap() {
    // var us = FileAttachment("counties-albers-10m.json").json()
    // var states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
    var color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])

    this.svg.append("g")
      .selectAll("path")
      .data(topojson.features)
      .join("path")
      // .attr("fill", d => color(data.get(d.id)))
      .attr("d", d3.geoPath())
      .append("title")
    //       .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
    // ${format(data.get(d.id))}`);

    // this.svg.append("path")
    //   .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    //   .attr("fill", "none")
    //   .attr("stroke", "white")
    //   .attr("stroke-linejoin", "round")
    //   .attr("d", d3.geoPath());
  }

}

