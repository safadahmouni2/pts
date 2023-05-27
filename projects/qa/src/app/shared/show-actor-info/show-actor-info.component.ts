import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-actor-info',
  templateUrl: './show-actor-info.component.html',
  styleUrls: ['./show-actor-info.component.css']
})
export class ShowActorInfoComponent {

  @Input() actorInfo: any;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('right_aligned') rightAligned = false;
  dropdownGeneratedId = 'details-dropdown-' + new Date().getTime();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('append_to') appendTo = '';

}
