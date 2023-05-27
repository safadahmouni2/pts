import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TrainingService } from '../app/services/training.service'
import { SmartObjectService } from '../app/services/SO.service'
import { TrainingEntry } from '../app/webservice/generated/hr-smart-service/model/trainingEntry'
import { SmartObjectEntry } from '../app/webservice/generated/hr-smart-service/model/smartObjectEntry'
import { map, filter, scan, mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HR-SMART';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private TrainingService: TrainingService,
    private SmartObjectService: SmartObjectService,
  ) { }
  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data))
      .subscribe((event) => this.titleService.setTitle(event['title']));

      
  }

 
  // submit(TrainingEntry: TrainingEntry, SmartObjectEntry: SmartObjectEntry){
  //   this.TrainingService.addTraining(TrainingEntry).subscribe();
  //   this.SmartObjectService.addSmartObject(SmartObjectEntry).subscribe();
  // }


}
