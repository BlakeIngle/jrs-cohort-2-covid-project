import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountyPageComponent } from './components/county-page/county-page.component';
import { CovidAppComponent } from './components/covid-app/covid-app.component';

const routes: Routes = [
  { path: "", component: CovidAppComponent },
  { path: ":state/:county", component: CountyPageComponent },
  { path: ":state/:county/:days", component: CountyPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
