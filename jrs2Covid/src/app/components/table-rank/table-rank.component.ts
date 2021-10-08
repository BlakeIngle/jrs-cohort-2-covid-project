import { Component, OnInit, Input } from '@angular/core';
import { WorldometersService } from 'src/app/services/worldometers.service';
import { ActivatedRoute } from '@angular/router';
import { RegionData } from 'src/app/models/regionData.model';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table-rank',
  templateUrl: './table-rank.component.html',
  styleUrls: ['./table-rank.component.css']
})
export class TableRankComponent implements OnInit {

  @Input() data: RegionData[];

  sortingColumn: string = 'region';
  sortingOrder: number = 1; // 1 - asc, -1 - decs

  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;

  tableHeaders = [
    {
      label: "State",
      value: "region"
    },
    {
      label: "Cases",
      value: "totalCases"
    },
    {
      label: "Deaths",
      value: "totalDeaths"
    },
    {
      label: "Population",
      value: "population"
    },
    //todayCases?: number;
    // todayDeaths?: number;
    // todayRecovered?: number;
    // todayActive
  ]

  constructor(
    private worldService: WorldometersService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.determineStateOrRegion();
    this.sort();
  }

  ngOnChanges() {
    this.determineStateOrRegion();
    this.sortAlphabetically();
  }

  private determineStateOrRegion() {
    if (this.data && this.data.length > 0) {
      // actually has data
      if (!this.data[0].fips) {
        // that means this is a state data
        this.tableHeaders[0].label = "State"
      } else {
        this.tableHeaders[0].label = "County"
      }
    }
  }

  sort() {
    // this.sortingColumn
    if (this.sortingColumn == 'region') {
      this.sortAlphabetically();
    } else {
      this.sortNumerically();
    }
  }

  sortAlphabetically() {
    if (!this.data) { return; }

    this.data = this.data.sort((a, b) => {
      if (a.region > b.region) {
        return 1 * this.sortingOrder;
      }
      if (b.region > a.region) {
        return -1 * this.sortingOrder;
      }
      return 0;
    })
  }

  sortNumerically() {
    this.data = this.data.sort((a, b) => {
      return (a[this.sortingColumn] - b[this.sortingColumn]) * this.sortingOrder;
    });
  }

  changeSortingMethod(column: string) {
    if (this.sortingColumn == column) {
      this.sortingOrder = this.sortingOrder * -1;
    } else {
      if (column == "region") {
        this.sortingOrder = 1;
      } else {
        this.sortingOrder = -1;
      }
    }
    this.sortingColumn = column;
    this.sort();
  }
}
