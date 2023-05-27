import { Component, Input, OnChanges } from '@angular/core';
import { UserStoryServices } from '../../services/userStoryServices';
import { UserStory } from '../../models/UserStory';
import { Globals } from '../../config/globals';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-run-user-story',
  templateUrl: './test-run-user-story.component.html',
  styleUrls: ['./test-run-user-story.component.css']
})
export class TestRunUserStoryComponent implements OnChanges {

  showDetails = true;
  showAttachments = false;
  @Input() userStoryId: number;
  userStory: UserStory;
  chatUrl: string;
  isProd = environment.production;

  constructor(
    private userStoryServices: UserStoryServices,
    private globals: Globals) {
  }

  ngOnChanges() {
    this.getUserStoryById(this.userStoryId);
    this.chatUrl = this.globals.getChatUrl(this.userStoryId, 'us');
  }

  toggleUserStoryDetails() {
    this.showDetails = !this.showDetails;
  }

  toggleAttachments() {
    this.showAttachments = !this.showAttachments;
  }

  getUserStoryById(userStoryId: number): void {
    this.userStoryServices.getUserStoryById(userStoryId).subscribe(
      (data) => {
        this.userStory = data;
      });
  }

}
