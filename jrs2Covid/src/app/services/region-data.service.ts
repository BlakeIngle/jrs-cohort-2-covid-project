import { Injectable } from '@angular/core';
import { RegionData } from '../models/regionData.model';
import countyPopulations from '../../assets/counties_population.json';

@Injectable({
  providedIn: 'root'
})
export class RegionDataService {

  constructor() { }

  public findStateInData(stateName: string, regions: RegionData[]) {
    return regions.find(d => d.region == stateName);
  }

  /**
   * Fill in the missing properties of a region data object
   * The properties that can be logically assumed from other data
   * @param region an incomplete region date object
   */
  public cleanUp(region: RegionData) {
    if (!region.stateFips && region.fips) {
      region.fips = region.fips.slice(0, 2) // first 2 characters
    }
    if (!region.fips || !region.stateFips || !region.population) {
      //check if county
      let county = countyPopulations.find(c => c.region.toLowerCase() == region.parentRegion.toLowerCase()
        && c.subregion.toLowerCase() == region.region.toLowerCase());
      if (county) {
        region.fips = county.us_county_fips;
        region.stateFips = county.us_state_fips;
        region.population = county.population;
      } else {
        let state = countyPopulations.find(c => c.region.toLowerCase() == region.region.toLowerCase());
        if (state) {
          region.stateFips = state.us_state_fips;
        }
      }
    }

    if (!region.totalCases) {
      if (region.timeline.cases.length > 0) {
        region.totalCases = region.timeline.cases[region.timeline.cases.length - 1].value;
      }
    }
    if (!region.totalDeaths) {
      if (region.timeline.deaths.length > 0) {
        region.totalDeaths = region.timeline.deaths[region.timeline.deaths.length - 1].value;
      }
    }
    if (!region.totalRecovered) {
      if (region.timeline.recovered.length > 0) {
        region.totalRecovered = region.timeline.recovered[region.timeline.recovered.length - 1].value;
      }
    }

    if (!region.todayCases) {
      if (region.timeline.cases.length > 1) {
        // at least 2 days of data
        let cases = region.timeline.cases;
        region.todayCases = cases[cases.length - 1].value - cases[cases.length - 2].value;
      }
    }
    if (!region.todayDeaths) {
      if (region.timeline.deaths.length > 1) {
        // at least 2 days of data
        let deaths = region.timeline.deaths;
        region.todayDeaths = deaths[deaths.length - 1].value - deaths[deaths.length - 2].value;
      }
    }
    if (!region.todayRecovered) {
      if (region.timeline.recovered.length > 1) {
        // at least 2 days of data
        let recovered = region.timeline.recovered;
        region.todayRecovered = recovered[recovered.length - 1].value - recovered[recovered.length - 2].value;
      }
    }
  }
}
