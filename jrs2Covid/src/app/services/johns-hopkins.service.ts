import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegionData } from '../models/regionData.model';
import countiesPopulation from '../../assets/counties_population.json';

@Injectable({
  providedIn: 'root'
})
export class JohnsHopkinsService {

  constructor(private http: HttpClient) { }

  getUSACountyNumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/jhucsse/counties`)
  }

  getAllCountyNumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/jhucsse/counties`);
  }

  getCountyNumbers(county: string) {
    return this.http.get(`https://disease.sh/v3/covid-19/jhucsse/counties/${county}`);
  }

  getCountyNumbersByState(state: string, day?: number) {
    return this.http.get(`https://disease.sh/v3/covid-19/historical/usacounties/${state.toLowerCase()}?lastdays=${day ? day : 1}`);
  }

  private convertOneData(data: any): RegionData {

    let counties: any[] = countiesPopulation;

    var cases;
    var deaths;
    var todayCases;
    var todayDeaths;

    if (data.timeline) {
      cases = Object.keys(data.timeline.cases).map(key => {
        return {
          date: new Date(key),
          value: data.timeline.cases[key]
        }
      });

      deaths = Object.keys(data.timeline.deaths).map(key => {
        return {
          date: new Date(key),
          value: data.timeline.deaths[key]
        }
      });

      todayCases = (cases.length < 2 ? null : cases[cases.length - 1].value
        - cases[cases.length - 2].value);

      todayDeaths = (deaths.length < 2 ? null : deaths[deaths.length - 1].value
        - deaths[deaths.length - 2].value)

    } else if (data.stats) {
      todayCases = null;
      cases = [{
        date: new Date(data.updatedAt.split(" ")[0]),
        value: data.stats.confirmed
      }];
      todayDeaths = null;
      deaths = [{
        date: new Date(data.updatedAt.split(" ")[0]),
        value: data.stats.deaths
      }];
    }


    let county = counties.find(
      c => c.subregion.toLowerCase() == data.county.toLowerCase()
        && data.province.toLowerCase() == c.region.toLowerCase()
    )

    let region: RegionData = {
      region: data.county,
      parentRegion: data.province,

      fips: county ? county.us_county_fips : null,
      stateFips: county ? county.us_state_fips : null,
      population: county ? county.population : null,

      totalCases: cases[cases.length - 1].value,
      totalDeaths: deaths[deaths.length - 1].value,
      totalRecovered: null,
      totalActive: null,

      todayCases: todayCases,
      todayDeaths: todayDeaths,

      timeline: {
        cases: cases,
        deaths: deaths,
        recovered: null
      }
    }

    return region;
  }

  public convertData(data: any | any[]): RegionData[] {
    if (Array.isArray(data)) {
      return data.map(d => { return this.convertOneData(d) })
        .filter(d => d.region.toLowerCase() != "unassigned"
          && (d.region.toLowerCase()).search("out of ") == -1)
      // do not include 'unassigned' regions or the 'out of ...' regions
    } else {
      return [this.convertOneData(data)];
    }
  }
}
