import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegionData } from '../models/regionData.model';
import { RegionDataService } from './region-data.service';
import countiesPopulation from '../../assets/counties_population.json'

@Injectable({
  providedIn: 'root'
})
export class NytService {

  constructor(private http: HttpClient,
    private regionDataService: RegionDataService) { }

  getAllStatesData(days?: number): Observable<any> {
    return this.http.get(`https://disease.sh/v3/covid-19/nyt/states?lastdays=${days ? days : 30}`);
  }

  convertData(data: any[]): RegionData[] {
    let regions: RegionData[] = [];
    for (let first of data) {
      // 'first' being the first obj with this state name
      // repeat obj with the same state refered to as 'other'
      let state = first.state;
      if (this.findStateInData(state, regions)) {
        continue;
      } else {
        // state not added to regions
        let region = new RegionData();
        let date = new Date(first.date);

        // initialize region with one date in timeline
        region = {
          region: state,
          parentRegion: "USA",
          stateFips: first.fips,
          fips: null,
          population: null,

          totalCases: null,
          totalDeaths: null,
          totalRecovered: null,
          totalActive: null,

          todayCases: null,
          todayDeaths: null,
          todayRecovered: null,
          todayActive: null,

          timeline: {
            cases: [{
              date: date,
              value: first.cases
            }],
            deaths: [{
              date: date,
              value: first.deats
            }],
            recovered: []
          }

        }
        // end original initialization

        // add other dates to timelines via other d objects from api
        for (let other of data) {
          if (first != other && other.state == state) {
            date = new Date(other.date);
            region.timeline.cases.push({
              date: date,
              value: other.cases
            })
            region.timeline.deaths.push({
              date: date,
              value: other.deaths
            })
          }
          // else is the original
        }
        this.regionDataService.cleanUp(region);
        regions.push(region);
      }
    }
    return regions;
  }

  private findStateInData(stateName: string, regions: RegionData[]) {
    return regions.find(d => d.region == stateName);
  }

}
