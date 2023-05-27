import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../../webservice/generated/hr-smart-service';
@Component({
  selector: 'app-propositions',
  templateUrl: './propositions.component.html',
  styleUrls: ['./propositions.component.css']
})

export class PropositionsComponent implements OnInit {
  public collapsed = false;
  public smartobject: any;
  searchtype: any;
  searchresponsable: any;
  searchurgency: any;
  searchdecision: any;
  filterDecision = new Array<any>();
  filterUrgency = new Array<any>();
  filterName = new Array<any>();
  allUser: any;
  freeSearch: any;
  constructor(private defaultService: DefaultService) {
  }
  ngOnInit() {
    this.getUsers();
    this.getTeamProposition();
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
  private getTeamProposition() {
    this.defaultService.getSmartObjects().subscribe((data) => {
      this.smartobject = data
        .filter(propostion => {
          return (propostion.type === 'p.tech' && propostion.status !== 'Onhold');
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

  private getUsers() {
    this.defaultService.getUsers().subscribe((data) => {
      this.allUser = data;
    });
  }

}
