import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson'
import { WorldometersService } from 'src/app/services/worldometers.service';
import { HttpClient } from '@angular/common/http';

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
  selector: 'choropleth',
  templateUrl: './choropleth.component.html',
  styleUrls: ['./choropleth.component.css']
})
export class ChoroplethComponent implements OnInit {
  data: Object;
  svg: any;
  margin = 80;
  width = 600;
  height = 400;

  constructor(private worldService: WorldometersService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/counties-albers-10m.json')
      .subscribe(counties => {

        this.worldService.getUSACountyNumbers()
          .subscribe((data: any) => {
            this.data = data;

            // console.log(this.data);

            this.createSvg();
            this.drawMap(data, counties);
          })
      })

  }

  createSvg() {
    this.svg = d3.select(".map-canvas")
      .append("svg")
      .attr("viewBox", [0, 0, 975, 610]);
  }

  drawMap(data: any[], us) {

    var states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
    var countiesMap = new Map(us.objects.counties.geometries.map(d => [d.properties.name, d.id]))

    var format = d => `${d}%`;
    var path = d3.geoPath()

    var maxCases = d3.max(this.data, d => d.stats.confirmed);
    // console.log(data[0].stats.confirmed)

    var min = d3.min(data, d => d.stats.confirmed)
    var max = d3.max(data, d => d.stats.confirmed)
    var extent = d3.extent(data, d => d.stats.confirmed)

    // var color = d3.scaleSqrt()
    //   .domain([min, max])
    //   .range(d3.schemeBuGn[9]);
    var color = d3.scaleSqrt()
      .domain([min, max])
      .range([0, 1]);

    console.log(states)
    this.svg.append("g")
      .selectAll("path")
      .data(feature(us, us.objects.counties).features)
      .join("path")
      .attr("fill", (d, i) => {
        let countyName = d.properties.name;
        let stateName = (states.get(d.id.slice(0, 2)) as any).name;
        let dataActual = data.find(c => c.county == countyName && c.province == stateName)


        return dataActual
          // ? color(dataActual.stats.confirmed)
          ? d3.interpolateOrRd(color(dataActual.stats.confirmed))
          : "#FFF"
      })
      .attr("d", path)
      .append("title")
      .text((d, i) => {
        let countyName = d.properties.name;
        let stateName = (states.get(d.id.slice(0, 2)) as any).name;

        let dataActual = data.find(c => c.county == countyName && c.province == stateName)
        return `${countyName}, ${stateName} - ${dataActual ? dataActual.stats.confirmed + ' total cases' : 'no data'
          }`
      });

    this.svg.append("path")
      .datum(mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);
  }

}