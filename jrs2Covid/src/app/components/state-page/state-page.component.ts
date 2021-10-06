import { Component, OnInit, Input } from '@angular/core';
import { WorldometersService } from '../../services/worldometers.service';
import { ActivatedRoute, Router } from '@angular/router';
import countiesPopulation from '../../../assets/counties_population.json';
import { JohnsHopkinsService } from '../../services/johns-hopkins.service';
import { RegionData } from '../../models/regionData.model.js';
import { VaccineService } from 'src/app/services/vaccine.service';
import { RegionDataService } from 'src/app/services/region-data.service';


@Component({
  selector: 'app-state-page',
  templateUrl: './state-page.component.html',
  styleUrls: ['./state-page.component.css']
})
export class StatePageComponent implements OnInit {
  @Input() subregions: [];

  state: string;
  countiesNames: string[];
  selectedCounty: string;
  stateData: RegionData;
  vaxData;
  vaxDates;
  dailyVax;
  us_state_fips;
  region;
  counties: RegionData[];
  stateQuery: any;

  constructor(private worldService: WorldometersService,
    private route: ActivatedRoute,
    private router: Router,
    private johnHopkinsService: JohnsHopkinsService,
    private vaccineService: VaccineService,
    private regionDataService: RegionDataService) { }

  ngOnInit(): void {
    this.state = this.route.snapshot.paramMap.get('state');

    this.countiesNames = countiesPopulation.filter(c =>
      c.region.toLowerCase() == this.state.toLowerCase())
      .map(c => c.subregion);

    this.worldService.getNumbersByState(this.state)
      .subscribe((data: any) => {
        this.stateData = this.worldService.convertData(data)[0];

        this.vaccineService.getVaccinesByState(this.state, 100)
          .subscribe((data: any) => {
            let vaxData = this.vaccineService.convertData(data)[0];
            this.stateData.timeline.vaccinations = vaxData.timeline.vaccinations;
            this.regionDataService.cleanUp(this.stateData)
          })
      });

    this.johnHopkinsService.getCountyNumbersByState(this.state)
      .subscribe((data: any) => {
        this.counties = this.johnHopkinsService.convertData(data);
        this.regionDataService.cleanUp(this.counties);
      })


  }

  onCountyClicked() {
    this.router.navigate([this.state, this.selectedCounty]);
  }



}

