import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../webservice/generated/hr-smart-service';
@Component({
  selector: 'app-myproposition',
  templateUrl: './myproposition.component.html',
  styleUrls: ['./myproposition.component.css']
})
export class MypropositionComponent implements OnInit {
  public collapsed = false;
  public smartobject: any;
  searchtype: any;
  searchurgency: any;
  searchdecision: any;
  userdata;
  filterDecision = new Array<any>();
  filterUrgency = new Array<any>();
  filterName = new Array<any>();
  freeSearch: any;
  constructor(private defaultService: DefaultService) { }

  ngOnInit() {
    this.getMyPropositions();
  }
  /****************************************/
  /*            public  Methods           */
  /****************************************/
  public collapse() {
    this.collapsed = !this.collapsed;
  }
  public onSearch(value) {
    this.freeSearch = value ;
  }
  /****************************************/
  /*            private  Methods           */
  /****************************************/
  private getMyPropositions() {
    this.userdata = JSON.parse(sessionStorage.getItem('currentUser'));
    this.defaultService.getUserSmartObjects(this.userdata.code).subscribe((data) => {
      this.smartobject = data
        // eslint-disable-next-line @typescript-eslint/no-shadow
        .filter(proposition => {
          return proposition.type !== 'pt';
        });
      // get distinct smart object
      this.filterDecision = Array.from(new Set(this.smartobject.map(s => s.status))).map(y => {
        return { status: y };
      });
      this.filterUrgency = Array.from(new Set(this.smartobject.map(s => s.urgency))).map(y => {
        return { urgency: y };
      });
      this.filterName = Array.from(new Set(this.smartobject.map(s => s.name))).map(y => {
        return { name: y };
      });
    });
  }

}
