import { Component, OnInit, Input } from '@angular/core';
import { WorldometersService } from '../../services/worldometers.service';
import { ActivatedRoute, Router } from '@angular/router';
import countiesPopulation from '../../../assets/counties_population.json';
import { JohnsHopkinsService } from '../../services/johns-hopkins.service';
import { RegionData } from '../../models/regionData.model.js';


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
    private johnHopkinsService: JohnsHopkinsService) { }

  ngOnInit(): void {


    // console.log(this.route.snapshot)
    this.state = this.route.snapshot.paramMap.get('state');
    // console.log(this.state)

    this.countiesNames = countiesPopulation.filter(c =>
      c.region.toLowerCase() == this.state.toLowerCase())
      .map(c => c.subregion);

    this.worldService.getNumbersByState(this.state)
      .subscribe((data: any) => {
        this.stateData = this.worldService.convertData(data)
      });

    this.johnHopkinsService.getCountyNumbersByState(this.state)
      .subscribe((data: any) => {

        this.counties = data.map(c => this.johnHopkinsService.convertData(c))
      })
  }

  onCountyClicked() {
    this.router.navigate([this.state, this.selectedCounty]);
  }



}

