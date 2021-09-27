import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CovidAppComponent } from './components/covid-app/covid-app.component';

const routes: Routes = [
  { path: "", component: CovidAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
