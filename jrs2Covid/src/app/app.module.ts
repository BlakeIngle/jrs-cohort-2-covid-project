import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CovidAppComponent } from './components/covid-app/covid-app.component';
import { StatePageComponent } from './components/state-page/state-page.component';
import { CountyPageComponent } from './components/county-page/county-page.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { ChoroplethComponent } from './components/choropleth/choropleth.component';

@NgModule({
  declarations: [
    AppComponent,
    CovidAppComponent,
    StatePageComponent,
    CountyPageComponent,
    PieChartComponent,
    LineGraphComponent,
    ChoroplethComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
