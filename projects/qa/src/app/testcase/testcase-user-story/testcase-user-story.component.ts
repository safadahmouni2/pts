import { Component, Input, OnInit } from '@angular/core';
import { UserStory } from '../../models/UserStory';
import { UserStoryServices } from '../../services/userStoryServices';
import { environment } from '../../../environments/environment';
import { Globals } from '../../config/globals';

@Component({
  selector: 'app-testcase-user-story',
  templateUrl: './testcase-user-story.component.html',
  styleUrls: ['./testcase-user-story.component.css']
})
export class TestcaseUserStoryComponent implements OnInit {

  showDetails = true;
  showAttachments = false;
  @Input() userStory: UserStory;
  pathAttachment = `${environment.gatewayUrl}/qa-service/attachment/Ticket_`;
  listAttachments = [];
  chatUrl: string;
  isProd = environment.production;

  constructor(private userStoryServices: UserStoryServices, private globals: Globals) { }

  ngOnInit() {
    this.chatUrl = this.globals.getChatUrl(this.userStory[0]?.id, 'us');
  }

  /**
   * Load attachments list of US
   */
  public getAttachmentsUS(usId): void {
    this.userStoryServices.getAttachmentsListByUserStoryId(usId).subscribe(
      data => {
        if (data) {
          this.listAttachments = data;
        }

      }
    );
  }

  toggleUserStoryDetails() {
    this.showDetails = !this.showDetails;
  }
  toggleAttachments() {
    this.showAttachments = !this.showAttachments;
  }

}
