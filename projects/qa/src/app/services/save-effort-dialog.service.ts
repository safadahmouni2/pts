import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestEffort } from '../models/TestEffort';
import { SaveEffortDialogComponent } from '../shared/save-effort-dialog/save-effort-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SaveEffortDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    testId: number,
    testShortDescription: string,
    testEffort: any,
    dialogSize: 'sm' | 'lg' = 'sm'
  ): Promise<any> {
    const modalRef = this.modalService.open(SaveEffortDialogComponent, {
      size: dialogSize, backdrop: 'static',
      backdropClass: 'modal-backdrop-transparent'
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.testId = testId;
    modalRef.componentInstance.testShortDescription = testShortDescription;
    modalRef.componentInstance.testEffort = testEffort;

    return new Promise<any | null>((resolve, reject) => {
      modalRef.result.then((result) => {
        if (result === true) {
          resolve(modalRef.componentInstance.testEffort);
        } else {
          resolve(null);
        }
      }, reject);
    });
  }
}
