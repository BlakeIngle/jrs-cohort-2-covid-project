import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StateNamesService } from '../services/state-names.service';

/**
 * authorized the route to allow state abbreviations 
 * to redirect to proper state pages
 * */
@Injectable({
  providedIn: 'root'
})
export class StateAuthGuard implements CanActivate {

  constructor(private router: Router,
    private stateNameService: StateNamesService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let stateName = route.params.state;
    let fullName = this.stateNameService.getFullNameFromAbbreviation(stateName.toUpperCase());
    if (fullName) {
      this.router.navigate([fullName])
      return false;
    }
    return true;
  }

}
