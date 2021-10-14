import { Component, OnInit } from '@angular/core';
import { JohnsHopkinsService } from 'src/app/services/johns-hopkins.service';
import { RegionData } from 'src/app/models/regionData.model';
import { ActivatedRoute } from '@angular/router';
import { RegionDataService } from 'src/app/services/region-data.service';


@Component({
  selector: 'county-page',
  templateUrl: './county-page.component.html',
  styleUrls: ['./county-page.component.css']
})
export class CountyPageComponent implements OnInit {

  stateName;
  countyName;
  county: RegionData;
  countyAsArray: RegionData[];
  countiesNames: string;
  state: string;
  svg;

  // margin = 50;
  width = 750;
  height = 500;
  radius = 250;

  constructor(private johnsHopkinsServices: JohnsHopkinsService,
    private regionDataService: RegionDataService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.stateName = this.route.snapshot.paramMap.get("state")
    this.countyName = this.route.snapshot.paramMap.get("county")
    this.reloadData(93); // three months by default
  }

  reloadData(numberOfDays: number) {
    this.county = null;
    this.countyAsArray = null;
    this.johnsHopkinsServices.getCountyNumbersByState(this.stateName, numberOfDays)
      .subscribe(data => {
        let countyData = (data as any[]).find(c => c.county == this.countyName)
        this.county = this.johnsHopkinsServices.convertData(countyData)[0];
        this.regionDataService.cleanUp(this.county);
        this.countyAsArray = [this.county];
      });
  }

}