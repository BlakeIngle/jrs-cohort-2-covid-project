import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegionData } from '../models/regionData.model';
import countiesPopulation from '../../assets/counties_population.json';

@Injectable({
  providedIn: 'root'
})
export class WorldometersService {



  constructor(private http: HttpClient) { }

  getStateNumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/states`)
  }

  getNumbersByState(state) {
    return this.http.get(`https://disease.sh/v3/covid-19/states/${state}`)
  }

  convertData(state): RegionData {
    let counties: any[] = countiesPopulation;


    let region = new RegionData();

    region = {
      region: state.state,
      parentRegion: "USA",
      fips: null,
      stateFips: county ? county.us_state_fips : null,
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

    console.log(region);

    return region;
  }
}
