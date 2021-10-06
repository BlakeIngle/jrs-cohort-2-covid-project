import { Component, OnInit } from '@angular/core';
import { RegionData } from 'src/app/models/regionData.model';
import { NytService } from 'src/app/services/nyt.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  states: RegionData[];

  constructor(private nytService: NytService) { }

  ngOnInit(): void {
    this.states = [];

    this.nytService.getAllStatesData(40).subscribe(
      data => {
        this.states = this.nytService.convertData(data);
        console.log(this.states)
      }
    )
  }

}
