import { Component } from '@angular/core';
import { Globals } from '../../config/globals';

@Component({
  selector: 'app-test-execution',
  templateUrl: './test-execution.component.html',
  styleUrls: ['./test-execution.component.css']
})
export class TestExecutionComponent {
  focusedFIeld = '';
  showStatusDropdown = false;
  textEnvFilter:any;
  filterByState:any;


  constructor(public globals: Globals) { }

  fieldFocus(event, focusedFIeld) {
    event.target.parentNode.classList.add('focused');
    this.focusedFIeld = focusedFIeld;
  }

  fieldBlur(event) {
    if (event.target.value === '') {
      event.target.parentNode.classList.remove('focused');
    }
    this.focusedFIeld = '';
  }

  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  setStatus(statusName: string, event:any) {
    this.filterByState=statusName;
    this.showStatusDropdown = false;
    event.target.parentNode.parentNode.classList.add('focused');
  }

}
