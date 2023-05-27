import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pts-qa';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) { }
  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activatedRoute.queryParams.subscribe(params => {
          const tokenParamFromUrl = params['PTSSSOID'];
          if (tokenParamFromUrl !== undefined) {
            localStorage.setItem('PTSSSOID', tokenParamFromUrl);
          }
        });

      }
    });
  }

}
