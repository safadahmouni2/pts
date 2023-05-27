import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';
import { query } from '@angular/animations';
import { element } from 'protractor';


@Component({
  selector: 'app-management-sp-team',
  templateUrl: './management-sp-team.component.html',
  styleUrls: ['./management-sp-team.component.css']
})
export class ManagementSpTeamComponent implements OnInit {
  @Input() sprintId: number;
  @Input() productName: string;
  @Input() productId: number;
  @Output() actionLoading = new EventEmitter<boolean>();

  serverpath: string = 'https://pts.thinktank.de/';
  scrumMasterRole = 'Scrum master';
  showDropdown: boolean[] = [];
  isSM_SMD_By_Product: boolean;
  isSM_SMD_By_Sprint: boolean;
  smExist: boolean;
  productTeamMembers = [];
  sprintMembers = [];
  notAssignedRoles = [];

  constructor(
    private userService: UserService,
    private sprintMemberGrapgQlService: SprintMemberGraphQlService
  ) { }

  ngOnInit() {
    this.isScrumMasterOrScrumMasterDeputyByProduct(this.productId);
    this.isScrumMasterOrScrumMasterDeputyBySprint(this.sprintId);
    this.getSprintMembers();
  }

  getProductTeamMembers(): void {
    this.userService.getproductTeam(this.productName).subscribe(result => {
      this.productTeamMembers = result;

      // Synchronize
      this.productTeamMembers
        .filter(e => !Object.keys(this.sprintMembers).includes(e.user_code)) // list of users not yet sprintMembers
        .forEach(e => this.sprintMembers[e.user_code] = []); // add them to sprintMembers without any role
      });
  }

  getSprintMembers(): void {
    let stateId;
    const SearchSprintMemberInput = {
      sprintId: this.sprintId,
      stateId
    };    
    this.sprintMemberGrapgQlService.filterSprintMembers(SearchSprintMemberInput).subscribe(result => {
      this.sprintMembers = result.data.filterSprintMembers.items
        .reduce((sprintMembers, sm) => ({
          ...sprintMembers,
          [sm.userCode]: [...(sprintMembers[sm.userCode] || []), {id: sm.id, role: sm.role, stateId: sm.stateId}]
        }), {});
        this.getProductTeamMembers();
    });
  }

  getSprintMemberFullName(userCode: string):  string {
    const member = this.productTeamMembers.find(item => item.user_code === userCode);
    return member?.first_name+' '+member?.last_name;
  }

  getSprintMemberPhoto(userCode: string):  string {
    const member = this.productTeamMembers.find(item => item.user_code === userCode);
    return member?.photo;
  }

  isSprintMemberActive(userCode: string):  boolean {
    const member = this.sprintMembers[userCode].some(item => item.stateId === 1030058);
    return member;
  }

  displaySprintMemberNotAssignedRoles(index: number, userCode: string, query?: string): void {
    if (!this.showDropdown[index]) {
      this.userService.searchAllRolesByProductIdAndQuery(this.productId, query).subscribe(result => {
        const allRoles = result.map(r => r.role_name);
        const smRoles = this.sprintMembers[userCode].map(spm => spm.role);
        this.notAssignedRoles = allRoles.filter(r => !smRoles.includes(r)); // allRoles - smRoles = notAssignedRoles
        this.showDropdown[index] = true;
      });
    } else {
      this.notAssignedRoles = [];
      this.showDropdown[index] = false;
    }
  }

  assignRoleToSprintMember(event, index: number, userCode: string, role: string): void {
    this.onActionLoading(true);

    const sprintMember = {
      userCode: userCode,
      sprintId: this.sprintId,
      stateId: 1030058,
      role: role
    };

    this.sprintMemberGrapgQlService.createSprintMember(sprintMember).subscribe(result => {
      this.getSprintMembers();
      this.onActionLoading(false);
      if (role === this.scrumMasterRole) {
        this.smExist = true;
      }
    });

    this.showDropdown[index] = false;
    event.target.parentNode.parentNode.classList.remove('focused');
  }

  // update sprintMember selected role to active or inactive
  updateSprintMemberRoleState(userCode: string, id: number): void {
    const role = this.sprintMembers[userCode].find(e => e.id === id);
    const stateId = role.stateId === 1030058 ? 1030059 : 1030058;
    const sprintMemberInputData = {
      stateId: stateId,
    };

    this.onActionLoading(true);
    this.sprintMemberGrapgQlService.updateSprintMember(id, sprintMemberInputData).subscribe(data => {
      this.getSprintMembers();
      this.onActionLoading(false);
    });
  }

  // update all sprintMember roles to active or inactive
  updateSprintMemberState(userCode: string): void {
    const stateId = this.isSprintMemberActive(userCode) ? 1030059 : 1030058;
    const sprintMemberInputData = {
      stateId: stateId,
    };

    this.sprintMembers[userCode].forEach(e => {
      this.onActionLoading(true);
      this.sprintMemberGrapgQlService.updateSprintMember(e.id, sprintMemberInputData).subscribe(data => {
        this.getSprintMembers();
        this.onActionLoading(false);
      });
    });
  }

  onClickedOutside(index: number) {
    this.showDropdown[index] = false;
  }

  onActionLoading(loading: boolean) {
    this.actionLoading.emit(loading);
  }

  fieldFocus(event) {
    event.target.parentNode.classList.add('focused');
  }

  fieldBlur(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
  }

  isScrumMasterOrScrumMasterDeputyByProduct(productId: number) {

    this.userService.getCurrentUser().subscribe(dataSource => {
      this.userService.getListScrumMasterAndScrumMasterDeputyByProduct(productId).subscribe(data => {

        if (data.length > 0) {
          data.forEach(element => {
            if (element.user_id === dataSource[0].user_id) {
              this.isSM_SMD_By_Product = true;
            }
          });
        } else {
          console.log('no SM/SMD available');
          this.isSM_SMD_By_Product = false;
        }

      });
    });


  }

  isScrumMasterOrScrumMasterDeputyBySprint(sprintId: number) {

    this.userService.getCurrentUser().subscribe(dataSource => {
      this.userService.getListScrumMasterAndScrumMasterDeputyBySprint(sprintId).subscribe(data => {

        if (data.length > 0) {
          data.forEach(element => {
            if (element.responsible_id === dataSource[0].user_id) {
              this.isSM_SMD_By_Sprint = true;
            }
          });
        } else {
          console.log('no SM/SMD available');
          this.isSM_SMD_By_Sprint = false;
        }

      });
    });
  }

}
