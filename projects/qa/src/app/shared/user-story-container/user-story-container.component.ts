import { Component, Input, OnInit, } from '@angular/core';
import { UserStory } from '../../models/UserStory';
import {UserStoryServices} from "../../services/userStoryServices";

@Component({
  selector: 'app-user-story-container',
  templateUrl: './user-story-container.component.html',
  styleUrls: ['./user-story-container.component.css']
})
export class UserStoryContainerComponent implements OnInit {
  @Input() userStoryList: UserStory[];
  @Input() productEnvironments: any;

  constructor(private userStoryServices: UserStoryServices) { }

  ngOnInit() {
    this.userStoryServices.sharedUserStoryAndTestCaseList.next(this.userStoryList);
  }

}
