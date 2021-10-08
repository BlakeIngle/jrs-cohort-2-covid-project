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

  county: RegionData;
  data;
  svg;

  margin = 100;
  width = 750;
  height = 500;
  radius = 250;

  constructor(private johnsHopkinsServices: JohnsHopkinsService,
    private regionDataService: RegionDataService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    let stateName = this.route.snapshot.paramMap.get("state")
    let countyName = this.route.snapshot.paramMap.get("county")

    this.johnsHopkinsServices.getCountyNumbersByState(stateName, 30)
      .subscribe(data => {
        let countyData = (data as any[]).find(c => c.county == countyName)
        this.county = this.johnsHopkinsServices.convertData(countyData)[0];
        this.regionDataService.cleanUp(this.county);
      });
  }


}