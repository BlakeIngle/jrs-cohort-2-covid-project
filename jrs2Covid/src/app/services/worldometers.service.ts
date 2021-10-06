import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegionData } from '../models/regionData.model';
import countiesPopulation from '../../assets/counties_population.json';

@Injectable({
  providedIn: 'root'
})
export class WorldometersService {



  constructor(private http: HttpClient) { }

  getUSACountyNumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/jhucsse/counties`)
  }

  getSCVaccines() {
    return this.http.get(`https://disease.sh/v3/covid-19/vaccine/coverage/states/south%20carolina?lastdays=365&fullData=false`)
  }

  getStateNumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/states`)
  }

  getNumbersByState(state) {
    return this.http.get(`https://disease.sh/v3/covid-19/states/${state}`)
  }

  private convertOneData(state): RegionData {
    let counties: any[] = countiesPopulation;


    let region = new RegionData();

    let fipsState = counties.find(c => c.region == state.state)

    region = {
      region: state.state,
      parentRegion: "USA",
      fips: null,
      stateFips: fipsState ? fipsState.us_state_fips : null,
      population: state.population,

      totalCases: state.cases,
      totalDeaths: state.deaths,
      totalRecovered: state.recovered,
      totalActive: state.active,

      todayCases: state.todayCases,
      todayDeaths: state.todayDeaths,
      todayRecovered: null,
      todayActive: null,

      timeline: {
        cases: [{
          date: new Date(state.updated),
          value: state.cases
        }],
        deaths: [{
          date: new Date(state.updated),
          value: state.deaths
        }],
        recovered: [{
          date: new Date(state.updated),
          value: state.recovered
        }],
      }

    }

    return region;
  }

  public convertData(data: any | any[]): RegionData[] {
    if (Array.isArray(data)) {
      return data.map(d => this.convertOneData(d));
    } else {
      return [this.convertOneData(data)];
    }
  }
}
