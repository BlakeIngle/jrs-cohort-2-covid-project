import { Component, OnInit } from '@angular/core';
import { WorldometersService } from 'src/app/services/worldometers.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RegionData } from 'src/app/models/regionData.model';

@Component({
  selector: 'app-covid-app',
  templateUrl: './covid-app.component.html',
  styleUrls: ['./covid-app.component.css']
})
export class CovidAppComponent implements OnInit {

  stateQuery: string; // the state name that you type in the input box
  states: RegionData[];
  boxChecked
  radioValue

  breadcrumb: any[];
  stateName: any;
  countyName: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private worldService: WorldometersService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.convertBreadcrumb();
      }
    });
  }

  ngOnInit(): void {
    this.stateQuery = "";
    this.boxChecked = true
    this.radioValue = "";
    this.convertBreadcrumb();

    this.worldService.getStateNumbers()
      .subscribe((data: any) => {
        this.states = data.map(d => this.worldService.convertData(d))
      })
  }

  onClickedSearch() {
    this.router.navigate([this.stateQuery])
  }

  convertBreadcrumb() {

    // this.stateName = this.route.firstChild.snapshot.get("state")
    // this.countyName = this.route.snapshot.firstChild.get("county")
    console.log(this.route, this.route.firstChild)

    this.breadcrumb = [
      { label: "USA", value: "" },
    ];

    let state = this.route.firstChild.snapshot.paramMap.get('state');
    if (state) {
      this.breadcrumb.push(
        { label: this.allFirstLetterCaps(state), value: state },
      )
    }

    let county = this.route.firstChild.snapshot.paramMap.get('county');
    if (county) {
      this.breadcrumb.push(
        { label: this.allFirstLetterCaps(county), value: county }
      )
    }

  }

  allFirstLetterCaps(sentence: string) {
    const arr = sentence.split(" ");

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    return arr.join(" ");
  }
}
