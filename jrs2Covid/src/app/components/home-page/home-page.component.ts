import { Component, OnInit } from '@angular/core';
import { RegionData } from 'src/app/models/regionData.model';
import { NytService } from 'src/app/services/nyt.service';
import { WorldometersService } from '../../services/worldometers.service';
import { RegionDataService } from 'src/app/services/region-data.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  state: string;
  states: RegionData[];
  population: any;
  stateData: RegionData[];

  constructor(private nytService: NytService,
    private worldService: WorldometersService,
    private regionDataService: RegionDataService) { }

  ngOnInit(): void {
    this.reloadData(93); // three month by default
  }

  reloadData(numDays: number) {
    this.states = [];
    this.population = [];

    this.nytService.getAllStatesData(numDays).subscribe(
      nytData => {

        this.states = this.nytService.convertData(nytData);
        this.regionDataService.cleanUp(this.states)

        this.worldService.getStateNumbers()
          .subscribe((worldData: any[]) => {

            this.states.forEach((state) => {
              let _state = worldData.find((worldState): boolean => {
                return state.region.toLowerCase() == worldState.state.toLowerCase()
              });

              if (_state) {
                state.population = _state.population
              }

            });

          });

      });

  }

}


