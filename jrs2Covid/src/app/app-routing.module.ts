import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidAppComponent } from './components/covid-app/covid-app.component';
import { StatePageComponent } from './components/state-page/state-page.component';



const routes: Routes = [
  { path: "", component: CovidAppComponent },
  { path: ":state", component: StatePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
