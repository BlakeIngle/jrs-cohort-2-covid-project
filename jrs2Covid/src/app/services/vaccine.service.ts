import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegionData } from '../models/regionData.model';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http: HttpClient) { }

  public getVaccinesByState(state: string, days?: number) {
    if (state.toLowerCase() == "new york") {
      state += " state";
    }
    return this.http.get(`https://disease.sh/v3/covid-19/vaccine/coverage/states/${state}?lastdays=${days ? days : 30}&fullData=false`)
  }

  private convertOneData(data: any): RegionData {
    let region = new RegionData();
    let vaccinations = [];

    if (data.timeline) {
      vaccinations = Object.keys(data.timeline).map(day => {
        return {
          date: new Date(day),
          value: data.timeline[day]
        }
      });
    }

    region = {
      region: data.state,
      parentRegion: "USA",

      // fips: county ? county.us_county_fips : null,
      // stateFips: county ? county.us_state_fips : null,
      // population: county ? county.population : null,

      totalVaccinations: null,

      timeline: {
        vaccinations: vaccinations
      }
    }

    return region;
  }

  public convertData(data: any | any[]): RegionData[] {
    if (Array.isArray(data)) {
      return data.map(d => this.convertOneData(d));
    } else {
      return [this.convertOneData(data)]
    }
  }
}
