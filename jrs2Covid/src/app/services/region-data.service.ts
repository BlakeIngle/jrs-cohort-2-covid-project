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


  private cleanUpOne(region: RegionData) {

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

    if (!region.totalCases && region.timeline.cases) {
      if (region.timeline.cases.length > 0) {
        region.totalCases = region.timeline.cases[region.timeline.cases.length - 1].value;
      }
    }
    if (!region.totalDeaths && region.timeline.deaths) {
      if (region.timeline.deaths.length > 0) {
        region.totalDeaths = region.timeline.deaths[region.timeline.deaths.length - 1].value;
      }
    }
    if (!region.totalRecovered && region.timeline.recovered) {
      if (region.timeline.recovered.length > 0) {
        region.totalRecovered = region.timeline.recovered[region.timeline.recovered.length - 1].value;
      }
    }
    if (!region.totalVaccinations && region.timeline.vaccinations) {
      if (region.timeline.vaccinations.length > 0) {
        region.totalVaccinations = region.timeline.vaccinations[region.timeline.vaccinations.length - 1].value;
      }
    }

    if (!region.todayCases && region.timeline.cases) {
      if (region.timeline.cases.length > 1) {
        // at least 2 days of data
        let cases = region.timeline.cases;
        region.todayCases = cases[cases.length - 1].value - cases[cases.length - 2].value;
      }
    }
    if (!region.todayDeaths && region.timeline.deaths) {
      if (region.timeline.deaths.length > 1) {
        // at least 2 days of data
        let deaths = region.timeline.deaths;
        region.todayDeaths = deaths[deaths.length - 1].value - deaths[deaths.length - 2].value;
      }
    }
    if (!region.todayRecovered && region.timeline.recovered) {
      if (region.timeline.recovered.length > 1) {
        // at least 2 days of data
        let recovered = region.timeline.recovered;
        region.todayRecovered = recovered[recovered.length - 1].value - recovered[recovered.length - 2].value;
      }
    }
    if (!region.todayVaccinations && region.timeline.vaccinations) {
      if (region.timeline.vaccinations.length > 1) {
        // at least 2 days of data
        let vaccinations = region.timeline.vaccinations;
        region.todayVaccinations = vaccinations[vaccinations.length - 1].value - vaccinations[vaccinations.length - 2].value;
      }
    }
  }

  /**
  * Fill in the missing properties of a region data object
  * The properties that can be logically assumed from other data
  * @param data an incomplete region date object or array
  */
  public cleanUp(data: RegionData | RegionData[]) {
    if (Array.isArray(data)) {
      for (let region of data) {
        this.cleanUpOne(region);
      }
    } else {
      this.cleanUpOne(data);
    }
  }
}
