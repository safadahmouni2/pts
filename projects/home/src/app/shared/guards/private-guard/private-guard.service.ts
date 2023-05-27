import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CoreUserService } from '../../services/pts-api/core/core-user.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateGuardService implements CanActivate {

  constructor(
    private coreUserService: CoreUserService
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const ptsSSOIdParam = 'PTSSSOID';
    const hasPtsSSOIdParam = next.queryParamMap?.has(ptsSSOIdParam);
    if (hasPtsSSOIdParam) {
      localStorage.setItem('PTSSSOID', next.queryParamMap.get(ptsSSOIdParam));
    }

    return this.coreUserService.getCurrentUser()
     .pipe(take(1),
      map(user => {
        if (user && user[0]) {
          const userData = {
            id: user[0].user_id,
            code: user[0].user_code,
            firstName: user[0].first_name,
            lastName: user[0].last_name,
            company: user[0].company,
            role: user[0].role,
            photo: user[0].photo
          }
          this.coreUserService.currentUser$.next(userData);
          this.coreUserService.currentUser$.complete();
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
          return true;
        } else {
          console.log('%c>>>> User Not Logged', 'color:red;font-size:12px');
          return false;
        }
      }));
  }

}
