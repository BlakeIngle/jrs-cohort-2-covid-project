import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateNamesService {

  map: Map<string, string>;

  constructor() {

    let map = new Map();

    map.set("AL", "Alabama")
      .set("AK", "Alaska")
      .set("AZ", "Arizona")
      .set("AR", "Arkansas")
      .set("CA", "California")
      .set("CO", "Colorado")
      .set("CT", "Connecticut")
      .set("DE", "Delaware")
      .set("DC", "District Of Columbia")
      .set("FL", "Florida")
      .set("GA", "Georgia")
      .set("HI", "Hawaii")
      .set("ID", "Idaho")
      .set("IL", "Illinois")
      .set("IN", "Indiana")
      .set("IA", "Iowa")
      .set("KS", "Kansas")
      .set("KY", "Kentucky")
      .set("LA", "Louisiana")
      .set("ME", "Maine")
      .set("MD", "Maryland")
      .set("MA", "Massachusetts")
      .set("MI", "Michigan")
      .set("MN", "Minnesota")
      .set("MS", "Mississippi")
      .set("MO", "Missouri")
      .set("MT", "Montana")
      .set("NE", "Nebraska")
      .set("NV", "Nevada")
      .set("NH", "New Hampshire")
      .set("NJ", "New Jersey")
      .set("NM", "New Mexico")
      .set("NY", "New York")
      .set("NC", "North Carolina")
      .set("ND", "North Dakota")
      .set("OH", "Ohio")
      .set("OK", "Oklahoma")
      .set("OR", "Oregon")
      .set("PA", "Pennsylvania")
      .set("RI", "Rhode Island")
      .set("SC", "South Carolina")
      .set("SD", "South Dakota")
      .set("TN", "Tennessee")
      .set("TX", "Texas")
      .set("UT", "Utah")
      .set("VT", "Vermont")
      .set("VA", "Virginia")
      .set("WA", "Washington")
      .set("WV", "West Virginia")
      .set("WI", "Wisconsin")
      .set("WY", "Wyoming")
  }

  /**
   * Convert the abbvreviated 2 letter state code into the 
   * full name of the state
   * @param abv state name abbreviation | "AL", "OH", "TX" etc.
   */
  getFullNameFromAbbreviation(abv: string): void {

  }
}
