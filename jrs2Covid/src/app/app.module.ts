import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CovidAppComponent } from './components/covid-app/covid-app.component';
import { StatePageComponent } from './components/state-page/state-page.component';
import { CountyPageComponent } from './components/county-page/county-page.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { ChoroplethComponent } from './components/choropleth/choropleth.component';
import { TableRankComponent } from './components/table-rank/table-rank.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PieChartParentComponent } from './components/pie-chart-parent/pie-chart-parent.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    CovidAppComponent,
    StatePageComponent,
    CountyPageComponent,
    PieChartComponent,
    LineGraphComponent,
    ChoroplethComponent,
    TableRankComponent,
    HomePageComponent,
    PieChartParentComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
