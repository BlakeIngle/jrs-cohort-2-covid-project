import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorldometersService {

  constructor(private http: HttpClient) { }

  getSCNumbers() {
    return this.http.get('https://disease.sh/v3/covid-19/states/south carolina')
  }

  getUSA() {
    return this.http.get('https://disease.sh/v3/covid-19/countries/usa?strict=true')
  }

  getStatesRanked() {
    return this.http.get(`https://disease.sh/v3/covid-19/states?sort=cases`)
  }

  getUSANumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/nyt/usa`)
  }

  getUSACountyNumbers() {
    return this.http.get(`https://disease.sh/v3/covid-19/jhucsse/counties`)
  }


  getSCVaccines() {
    return this.http.get(`https://disease.sh/v3/covid-19/vaccine/coverage/states/south%20carolina?lastdays=365&fullData=false
    `)
  }
}
