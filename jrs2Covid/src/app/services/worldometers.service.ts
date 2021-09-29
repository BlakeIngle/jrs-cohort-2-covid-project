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
}
