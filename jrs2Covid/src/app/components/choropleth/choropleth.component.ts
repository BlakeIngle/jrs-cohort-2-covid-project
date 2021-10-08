import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson';
import { WorldometersService } from '../../services/worldometers.service';
import { Router } from '@angular/router';
import countiesPopulation from '../../../assets/counties_population.json';
import usTopojson from '../../../assets/counties-albers-10m.json';
import { RegionDataService } from 'src/app/services/region-data.service';
import { RegionData } from 'src/app/models/regionData.model';
import { JohnsHopkinsService } from 'src/app/services/johns-hopkins.service';

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
  data: RegionData[];

  states: Map<unknown, unknown>;
  countiesMap: Map<unknown, unknown>;

  fillModes = {
    1: 'Total Cases', // sqrt
    2: 'Total Deaths', // sqrt
    3: 'Total Vaccinations', // sqrt
    4: 'Cases Per Population', // linear
    5: 'Deaths Per Population', // linear
    6: 'Vaccinations Per Population', // linear
  }
  fillMode: number = 1;
  colorScale;

  constructor(private worldService: WorldometersService,
    private regionDataService: RegionDataService,
    private jHopService: JohnsHopkinsService,
    private router: Router) { }

  ngOnInit(): void {
    this.us = usTopojson;

    this.jHopService.getUSACountyNumbers()
      .subscribe((data: any) => {
        this.data = this.jHopService.convertData(data)
        this.regionDataService.cleanUp(this.data);

        this.states = new Map(this.us.objects.states.geometries.map(d => [d.id, d.properties]))
        this.countiesMap = new Map(this.us.objects.counties.geometries.map(d => [d.properties.name, d.id]))

        this.createSvg();
        this.recolor(); // necessary setup
        this.drawMap();
      });

  }

  createSvg() {
    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on('zoom', evt => { return this.onZoom(evt) });

    this.svg = d3.select(".map-canvas")
      .append("svg")
      .attr("viewBox", [0, 0, 975, 610])

    this.svg.call(zoom);

  }

  drawMap() {

    var path = d3.geoPath()

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

        let dataActual = this.data.find(c => c.region == countyName && c.parentRegion == stateName)
        return `${countyName}, ${stateName} - ${dataActual ? dataActual.totalCases + ' total cases' : 'no data'
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

    let countyName = d.properties.name;
    let stateName = (this.states.get(d.id.slice(0, 2)) as any).name;
    let dataActual = (this.data).find(c => c.region == countyName && c.parentRegion == stateName);

    switch (this.fillMode) {
      case 1:
        return this.getActualColor(dataActual?.totalCases);
      case 4:
        return this.getActualColor(dataActual?.totalCases / dataActual?.population);
      case 2:
        return this.getActualColor(dataActual?.totalDeaths);
      case 5:
        return this.getActualColor(dataActual.totalDeaths / dataActual.population);
      default:
        return "#FFF";
    }
  }

  private getActualColor = (n) => {
    return n
      ? d3.interpolateOrRd(this.colorScale(n))
      : "#FFF"
  }

  public recolor() {

    this.fillMode = Number(this.fillMode);
    var min = 0;
    var max = 0;

    let legendColor;

    switch (this.fillMode) {
      case 1:
        min = d3.min(this.data, d => d.totalCases)
        max = d3.max(this.data, d => d.totalCases)
        break;
      case 4:
        min = d3.min(this.data, d => d.totalCases / d.population)
        max = d3.max(this.data, d => !d.population ? 0 : (d.totalCases / d.population));
        break;
      case 2:
        min = d3.min(this.data, d => d.totalDeaths)
        max = d3.max(this.data, d => d.totalDeaths)
        break;
      case 5:
        min = d3.min(this.data, d => d.totalDeaths / d.population)
        max = d3.max(this.data, d => d.totalDeaths / d.population)
        break;
      case 3:
        min = d3.min(this.data, d => d.totalCases)
        max = d3.max(this.data, d => d.totalCases)
        break;
      case 6:
        min = d3.min(this.data, d => d.totalCases / d.population)
        max = d3.max(this.data, d => d.totalCases / d.population)
        break;
    }

    switch (this.fillMode) {
      case 1:
      case 2:
      case 3:
        this.colorScale = d3.scaleSqrt()
          .domain([min, max])
          .range([0, 1]);
        legendColor = d3.scaleSqrt([min, max], d3.interpolateOrRd)
        break;
      case 4:
      case 5:
      case 6:
        this.colorScale = d3.scaleLinear()
          .domain([min, max])
          .range([0, 1]);
        legendColor = d3.scaleLinear([min, max], d3.interpolateOrRd)
        break;
    }

    this.legend(legendColor, { title: "hi" });

    this.svg.selectAll('.county')
      .attr('fill', (d, i) => { return this.fill(d, i) });
  }

  legend(color, title) {

    let tickSize = 6;
    let width = 320;
    let height = 44 + tickSize;
    let marginTop = 18;
    let marginRight = 0;
    let marginBottom = 16 + tickSize;
    let marginLeft = 0;
    let ticks = width / 64;
    let tickFormat;
    let tickValues;

    let x = d3.scaleLinear()
      .range([marginLeft, width - marginRight]);

    const svg = this.svg.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block")

    // Linear
    if (this.fillMode < 4) {
      // mode 1, 2, or 3 -> linear scale

      const n = Math.min(color.domain().length, color.range().length);

      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

      this.svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
      // .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }

  }

  onZoom(evt) {
    this.svg.selectAll('path') // To prevent stroke width from scaling
      .attr('transform', evt.transform);
  }

}