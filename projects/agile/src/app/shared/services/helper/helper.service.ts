import { Injectable } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  public isNullOrUndefined<T>(object: T | undefined | null): boolean {
    return <T>object === undefined || <T>object === null;
  }

  /**
   * Deep clone object it recursively clones `object`
   * @param {*} obj The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   */
  public cloneObject(obj: Object) {
    return cloneDeep(obj);
  }

  /**
   * Build chat url based on `ticketId`
   * @param number ticketId The ticketId to build chat url.
   * @returns string Returns the chat url.
   */
  public getChatUrl(objectId: number, objectType?: string): string {
    const userCode = JSON.parse(sessionStorage.currentUser).usercode;
    const serverId = this.getServerId(objectType);
    return `https://chat.thinktank.de/chat?serverId=${serverId}&userCode=${userCode}&ticketId=${objectId}`;
  }

  private getServerId(objectType: string): string {
    let serverId = '';
    switch (objectType) {
      case 'FEATURE':
        serverId = 'AGILE23ZSM_PETImsBLRRRdIxC_x1716-FEATURE';
        break;
      default:
        serverId = 'DEPTSPROTTDC_LLMMG57965XXX_x12_YBB';
        break;
    }
    return serverId;
  }
}
