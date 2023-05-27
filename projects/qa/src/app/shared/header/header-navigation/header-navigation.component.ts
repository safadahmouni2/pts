import { Component, OnInit } from '@angular/core';
import { ProductsServices } from '../../../services/productsServices';
import { DatePipe } from '@angular/common';
import { Globals } from '../../../config/globals';
import { TokenStorageService } from '../../../auth/token-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SprintsService } from '../../../services/sprintsService';
import { UserService } from '../../../services/userService';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { TestCaseChangeRequestService } from '../../../services/test-case-change-request.service';
import { SprintGrapgQlService } from '../../../services/pts-api/agile/sprint.service';

@Component({
  selector: 'app-header-navigation',
  templateUrl: './header-navigation.component.html',
  styleUrls: ['./header-navigation.component.css']
})
export class HeaderNavigationComponent implements OnInit {
  sprintStates = [];
  productList: any;
  sprintList: any;
  dateStart: string;
  dateEnd: string;
  infoCnx: any;
  productId: any;
  changeRequests: number;
  user: any;
  destroy$ = new Subject();
  baseURL: string = 'https://pts.thinktank.de';
  appVersion: string = environment.appVersion;

  constructor(
    private productsServices: ProductsServices, private sprintsServices: SprintsService, private userService: UserService,
    public datePipe: DatePipe,
    public globals: Globals,
    private token: TokenStorageService, private spinner: NgxSpinnerService,
    private testCaseChangeRequestService: TestCaseChangeRequestService,
    private route: Router,
    private sprintGrapgQlService: SprintGrapgQlService) {
  }

  ngOnInit() {
    
    this.getProductList();
    this.getCurrentUser();

    this.infoCnx = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };

    const source = timer(1000, 2000000000);
    const subscribe = source.subscribe(val => {
      this.testCaseChangeRequestService.getCountOfTestCaseChangeRequestByProductId(+this.globals.getProductId()).subscribe(
        data => {
          this.changeRequests = data;
        },
        err => { console.log(err); }
      );
    });
    this.getAllSprintStates();
  }

  getProductList(): void {
    this.productsServices.getAllProductsByUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          this.productList = data;

          if (this.route.url.includes('product-dashboard')) {
            this.getSelectedProduct();
          }
        }
      );
  }

  getSelectedProduct(): void {
    if (this.globals.getProductId()) {
      for (const product of this.productList) {
        if (product.product_id === +this.globals.getProductId()) {
          this.selectProduct(product);
        }
      }
    }
    this.getChangeRequest();
  }

  getChangeRequest() {
    this.testCaseChangeRequestService.getCountOfTestCaseChangeRequestByProductId(+this.globals.getProductId()).subscribe(
      data => {
        this.changeRequests = data;
      },
      err => { console.log(err); }
    );
  }

  getCurrentUser(): void {
    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          if (data.length) {
            this.user = data[0];
            console.log('save user code in session storage');
            this.globals.saveUserCode(data[0].user_code, data[0].user_id);
          }
        }
      );
  }

  selectProduct(product: any): void {
    this.sprintGrapgQlService.getSprintsByProductId(product.product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(sprintsByProductId => {
        let sprints = sprintsByProductId.data.getSprintsByProductId.items;

        if (sprints.length !== 0) {

          this.sprintList = sprints;
          this.sprintList.forEach(sprint => {
            sprint.state = this.sprintStates.find(state => state.status_id == sprint.stateId) ?.name ;
          })
          this.getSelectedSprint();
        }
      }
      );
    this.globals.product = product;
    this.globals.saveProductId(product.product_id);
    this.globals.saveProductName(product.product_name.toString());
    this.sprintList = product.sprintList;
    this.globals.sprint = null;

    this.route.navigate(['product-dashboard']);
  }

  getSelectedSprint(): void {
    if (this.globals.getSprintId()) {
      const sprint = this.sprintList.find((sprint) => {
        if (sprint.ticketId !== undefined) {
          return sprint.ticketId === +this.globals.getSprintId();
        }
      })
      if (sprint === undefined) {
        const currentSprint = this.sprintList.find((sprint) => {
          return sprint.state === "In progress";
        });

        currentSprint ? this.globals.saveSprintId(currentSprint.ticketId.toString()) : this.globals.saveSprintId(this.sprintList[0].ticketId.toString());
        currentSprint ? this.globals.saveSprintState(currentSprint.state) : this.globals.saveSprintState(this.sprintList[0].state);
        this.selectSprint(currentSprint ? currentSprint : this.sprintList[0]);
      } else {
        this.selectSprint(sprint);
      }
    }
  }

  selectSprint(sprint: any): void {
    this.globals.sprint = sprint;
    this.globals.saveSprintId(sprint.ticketId.toString());
    this.globals.saveSprintState(sprint.state);
  }

  logout() {
    this.token.signOut();
  }

  //get all sprint states
  private getAllSprintStates(): void {
    this.sprintsServices.getAllSprintStates().subscribe(states => {
      if (states) {
        this.sprintStates = states;
      }
    });

  }
}
