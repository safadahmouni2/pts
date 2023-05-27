import { UserStory } from './user-story.model';
import { Product } from './product.model';
export class Topic {
    id: number;
    ticketId: number;
    text: string;
    responsable: String;
    topicRqNb: number;
    editMode: boolean = false;
    _text: string;
    order: number;
    userStories: UserStory[] = [];
    product: Product;
    chat_url: string;
    name:string;
    comment:string;
    constructor() {
    }

    toggleEditMode(): void {
        this._text = this.text;
        this.editMode = !this.editMode;
    }
    // sum(complexity * if(progress=0,1, progress))/(if(count(*)=0,1, count(*))*100)
    progress(): number {
        let progress: number = 0;
        let complexitySum: number = 0;
        for (const userStory of this.userStories) {
            const complexity = userStory.storyPoints || 100;
            complexitySum += complexity;
            const usprogress = userStory.progress || 0;
            progress += (complexity * usprogress);
        }

        return progress / (((complexitySum === 0) ? 1 : complexitySum));
    }
    getSumStoryPoints(): number {
        let sum: number = 0;
        for (const userStory of this.userStories) {
            if (userStory.storyPoints != null) {
                sum += (+userStory.storyPoints);

            }

        }
        return sum;
    }
}
