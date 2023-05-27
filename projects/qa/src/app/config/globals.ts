import { Injectable } from '@angular/core';

const PRODUCT_ID = 'product-id';
const PRODUCT_NAME = 'product-name';
const SPRINT_ID = 'sprint-id';
const SPRINT_STATE = 'sprint_state';
const USER_STORY_ID = 'user-story-id';
const USER_CODE = 'user_code';
const USER_ID = 'user_ID';
@Injectable({
  providedIn: 'root'
})
export class Globals {
  product: any;
  sprint: any;
  userStory: any;
  useCode: any;
  userId: any;

  public saveSprintId(sprintId: string) {
    window.sessionStorage.removeItem(SPRINT_ID);
    window.sessionStorage.setItem(SPRINT_ID, sprintId);

  }

  public getSprintId(): string {
    return sessionStorage.getItem(SPRINT_ID);
  }

  public getSprintState(): string {
    return sessionStorage.getItem(SPRINT_STATE);
  }

  public saveSprintState(sprintState: string) {
    window.sessionStorage.removeItem(SPRINT_STATE);
    window.sessionStorage.setItem(SPRINT_STATE, sprintState);

  }


  public saveProductId(productId: string) {
    window.sessionStorage.removeItem(PRODUCT_ID);
    window.sessionStorage.setItem(PRODUCT_ID, productId);
  }

  public saveProductName(productName: string) {
    window.sessionStorage.removeItem(PRODUCT_NAME);
    window.sessionStorage.setItem(PRODUCT_NAME, productName);
  }


  public getProductName(): string {
    return sessionStorage.getItem(PRODUCT_NAME);
  }

  public getProductId(): string {
    return sessionStorage.getItem(PRODUCT_ID);
  }

  public saveUserStoryId(userStoryId: string) {
    window.sessionStorage.removeItem(USER_STORY_ID);
    window.sessionStorage.setItem(USER_STORY_ID, userStoryId);
  }
  public getUserStoryId(): string {
    return sessionStorage.getItem(USER_STORY_ID);
  }

  public getUserCode(): string {
    return sessionStorage.getItem(USER_CODE);
  }

  public getUserId(): string {
    return sessionStorage.getItem(USER_ID);
  }

  public saveUserCode(userCode: string, userId: string) {
    window.sessionStorage.removeItem(USER_CODE);
    window.sessionStorage.removeItem(USER_ID);
    window.sessionStorage.setItem(USER_CODE, userCode);
    window.sessionStorage.setItem(USER_ID, userId);
  }

  public isInvalidSprintSelected(): boolean {
    if (this.getSprintState() === 'In progress' || this.getSprintState() === 'Planned') {
      return false;
    } else {
      return true;
    }
  }


  public getChatUrl(ticketId: number, ticketType: string): string {
    const serverId = this.getServerId(ticketType);
    return `https://chat.thinktank.de/chat?serverId=${serverId}&userCode=${this.getUserCode()}&ticketId=${ticketId}`;
  }

  private getServerId(ticketType: string): string {
    let serverId = '';
    switch (ticketType) {
      case 'us_test_case':
        serverId = 'QA22YKC_PXUKONFWBdLdIxC_x170Y20A16-USTC';
        break;
      case 'test_run':
        serverId = 'QA22YKC_PXUKONFWBdLdIxC_x170Y20A16-TR';
        break;
      case 'test':
        serverId = 'QA22YKC_PXUKONFWBdLdIxC_x170Y20A16-TEST';
        break;
      case 'library_test_case':
        serverId = 'QA22YKC_PXUKONFWBdLdIxC_x170Y20A16-LIBTC';
        break;
      case 'test_step':
        serverId = 'QA22YKC_PXUKONFWBdLdIxC_x170Y20A16-TEST_STEP';
        break;
      default:
        serverId = 'DEPTSPROTTDC_LLMMG57965XXX_x12_YBB';
        break;
    }
    return serverId;
  }
}
