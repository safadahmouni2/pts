import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoreUserService } from '../../../shared/services/pts-api/core/core-user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  public env = environment;

  currentUser =  null;
  constructor(
    private coreUserService: CoreUserService
  ) {
  }
  ngOnInit(): void {

    this.coreUserService.currentUser$
    .pipe(takeUntil(this.destroy$))
    .subscribe((currentUserData) => {
      this.currentUser = currentUserData;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
