


import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map, filter, scan, mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})

export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) { }
  ngOnInit() {
    let title  ;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const state = this.router.getCurrentNavigation().extras.state;
        title = state?.title;

        this.activatedRoute.queryParams.subscribe(params => {
            const tokenParamFromUrl = params['PTSSSOID'];
          if (tokenParamFromUrl !== undefined) {
            localStorage.setItem('PTSSSOID', tokenParamFromUrl);
          }
        });

      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) { route = route.firstChild; }
        return route as ActivatedRoute;;
      }),
      filter((route: ActivatedRoute) => route.outlet === 'primary'),
      mergeMap((route: ActivatedRoute) => route.data))
      .subscribe((event) => {this.titleService.setTitle(title ? title : event['title']); });
  }

}
