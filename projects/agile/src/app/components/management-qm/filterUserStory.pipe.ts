import { Pipe, PipeTransform } from '@angular/core';
import { UserStory } from '../../models/user-story.model';
@Pipe({
  name: 'filterUserStory',
  pure: false
})
export class FilterUserStoryPipe implements PipeTransform {
  transform(userStories: UserStory[], args: any): any {
    args = args ? args : null;
    return args ? userStories.filter((userStory: UserStory) =>
      // eslint-disable-next-line eqeqeq
      (userStory.text.toLowerCase().indexOf(args) !== -1) || userStory.id == args) : userStories;
  }
}

