import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson';
import { WorldometersService } from 'src/app/services/worldometers.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import countiesPopulation from '../../../assets/counties_population.json';

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
  svg: any;
  margin = 80;
  width = 600;
  height = 400;

  us: any; // USA topo data
  data: any;

  states: Map<unknown, unknown>;
  countiesMap: Map<unknown, unknown>;

  fillModes = {
    1: 'Total Cases',
    2: 'Total Deaths',
    3: 'Total Vaccinations',
    4: 'Cases Per Population',
    5: 'Deaths Per Population',
    6: 'Vaccinations Per Population',
  }
  fillMode: number = 1;

  constructor(private worldService: WorldometersService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    let populationData = countiesPopulation;
    this.http.get('assets/counties-albers-10m.json')
      .subscribe((us: any) => {
        this.us = us;

        this.worldService.getUSACountyNumbers()
          .subscribe((data: any) => {
            this.data = data;
            console.log(data, populationData)
            this.data = this.data.map(d => {
              let c = populationData.find(p =>
                p.region == d.province && p.subregion == d.county
              );
              d.fips = c?.us_county_fips;
              d.population = Number(c?.population);

              return d;
            })

            console.log(this.data);
            this.states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))
            this.countiesMap = new Map(us.objects.counties.geometries.map(d => [d.properties.name, d.id]))

            this.createSvg();
            this.drawMap();
          })
      })

  }

  createSvg() {
    this.svg = d3.select(".map-canvas")
      .append("svg")
      .attr("viewBox", [0, 0, 975, 610]);
  }

  drawMap() {

    var path = d3.geoPath()

    var maxCases = d3.max(this.data, d => d.stats.confirmed);

    // draw counties
    this.svg.append("g")
      .selectAll("path")
      .data(feature(this.us, this.us.objects.counties).features)
      .join("path")
      .attr('class', 'county')
      .attr('state', (d) => {
        let stateName = (this.states.get(d.id.slice(0, 2)) as any).name;
        return stateName.toLowerCase();
      })
      .attr('county', (d) => d.properties.name.toLowerCase())
      .attr("fill", this.fill)
      .on('mouseover', function (d, i) {
        d3.selectAll('.county')
          .attr('opacity', 0.25)
        d3.select(this)
          .attr('opacity', 1)
      })
      .on('mouseout', function (d, i) {
        d3.selectAll('.county')
          .attr('opacity', 1)
      })
      .on('click', (evt) => {
        let state = evt.srcElement.getAttribute('state')
        let county = evt.srcElement.getAttribute('county')
        this.router.navigate([state, county])
      })
      .attr('stroke', '#ccc')
      .attr("d", path)
      .append("title")
      .text((d, i) => {
        let countyName = d.properties.name;
        let stateName = (this.states.get(d.id.slice(0, 2)) as any).name;

        let dataActual = this.data.find(c => c.county == countyName && c.province == stateName)
        return `${countyName}, ${stateName} - ${dataActual ? dataActual.stats.confirmed + ' total cases' : 'no data'
          }`
      });

    // draw states
    this.svg.append("path")
      .datum(mesh(this.us, this.us.objects.states, (a, b) => a !== b))
      .attr("class", "state")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-linejoin", "round")
      .attr("d", path)


    // draw country border
    this.svg.append("path")
      .data(feature(this.us, this.us.objects.nation).features)
      .join("path")
      .attr('stroke', '#555')
      .attr('fill', 'none')
      .attr("d", path)
  }

  // has to be arrow function to use 'this' keyword correctly
  private fill = (d, i) => {
    this.fillMode = Number(this.fillMode);
    var min = 0;
    var max = 0;

    var colorScale;
    var color;

    switch (this.fillMode) {
      case 1:
        min = d3.min(this.data, d => d.stats.confirmed)
        max = d3.max(this.data, d => d.stats.confirmed)
        break;
      case 4:
        min = d3.min(this.data, d => d.stats.confirmed / d.population)
        max = d3.max(this.data, d => d.stats.confirmed / d.population)
        break;
      case 2:
        min = d3.min(this.data, d => d.stats.deaths)
        max = d3.max(this.data, d => d.stats.deaths)
        break;
      case 5:
        min = d3.min(this.data, d => d.stats.deaths / d.population)
        max = d3.max(this.data, d => d.stats.deaths / d.population)
        break;
      case 3:
        min = d3.min(this.data, d => d.stats.confirmed)
        max = d3.max(this.data, d => d.stats.confirmed)
        break;
      case 6:
        min = d3.min(this.data, d => d.stats.confirmed / d.population)
        max = d3.max(this.data, d => d.stats.confirmed / d.population)
        break;
    }

    switch (this.fillMode) {
      case 1:
      case 2:
      case 3:
        colorScale = d3.scaleSqrt()
          .domain([min, max])
          .range([0, 1]);
        break;
      case 4:
      case 5:
        console.log(min, max)
      case 6:
        colorScale = d3.scaleLinear()
          .domain([min, max])
          .range([0, 1]);
        break;
    }

    let countyName = d.properties.name;
    let stateName = (this.states.get(d.id.slice(0, 2)) as any).name;
    let dataActual = (this.data as any[]).find(c => c.county == countyName && c.province == stateName);

    switch (this.fillMode) {
      case 1:
        return dataActual
          // ? color(dataActual.stats.confirmed)
          ? d3.interpolateOrRd(colorScale(dataActual.stats.confirmed))
          : "#FFF"
      case 4:
        return dataActual
          // ? color(dataActual.stats.confirmed)
          ? d3.interpolateOrRd(colorScale(dataActual.stats.confirmed / dataActual.population)) //   / population
          : "#FFF"
      case 2:
        return dataActual
          // ? color(dataActual.stats.confirmed)
          ? d3.interpolateOrRd(colorScale(dataActual.stats.deaths))
          : "#FFF"
      case 5:
        return dataActual
          // ? color(dataActual.stats.confirmed)
          ? d3.interpolateOrRd(colorScale(dataActual.stats.deaths / dataActual.population))
          : "#FFF"
    }


  }

  recolor() {
    this.svg.selectAll('.county')
      .attr('fill', this.fill);
  }

}