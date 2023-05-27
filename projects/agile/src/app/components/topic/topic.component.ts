import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Topic } from '../../models/topic.model';
import { UserStory } from '../../models/user-story.model';
import { TopicGrapgQlService } from '../../services/pts-api/agile/topic.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from '../../shared/services/helper/helper.service';
@Component({
    selector: 'app-topic',
    templateUrl: './topic.component.html'
})
export class TopicComponent implements OnDestroy {

    expanded: boolean = false;
    addCommentMode: boolean = false;
    commentsExpanded: boolean = false;
    @Input() topic: Topic;
    @Output('ShowTopicDetail') nofiy: EventEmitter<Topic> = new EventEmitter<Topic>();

    destroy$ = new Subject();
    constructor(
        private topicGrapgQlService: TopicGrapgQlService,
        private helper: HelperService
    ) { }


    ngOnDestroy(): void {
        this.destroy$.next(undefined);
        this.destroy$.complete();
    }

    toggleExpand(): void {
        this.expanded = !this.expanded;
    }

    saveTopic(topic: Topic): void {
        let new_Order, max_Order, old_Ord, OrderDec: any;
        if (topic.id == null) {

            this.topicGrapgQlService.getTopicMaxOrder(topic.product.productId).subscribe(maxOrderData => {
                max_Order = maxOrderData.data.getTopicMaxOrderByProduct.maxOrder;

                if (max_Order) {
                    new_Order = parseInt(max_Order, 10) + parseInt('100', 10);
                } else {
                    new_Order = parseInt('100', 10);
                }
                const topicInputData = {
                    productId: topic.product.productId,
                    name: topic._text,
                    displayOrder: new_Order,
                    stateId: 1018020 // Created :: TODO get Start Status from PTS by Type
                };
                this.topicGrapgQlService.createTopic(topicInputData)
                    .pipe(
                        takeUntil(this.destroy$)
                    )
                    .subscribe((resultCreateTopic) => {
                        const dataSource = resultCreateTopic.data.createTopic
                        topic.editMode = false;
                        topic.id = dataSource.id;
                        topic.text = dataSource.name;
                        /*topic.chat_url = dataSource.data.chat_url;*/
                        topic.order = dataSource.displayOrder;
                    }
                    );
            });

        } else {
            old_Ord = topic.order;
            const topicInputData = {
                name: topic._text
            };
            this.topicGrapgQlService.updateTopic(topic.id, topicInputData)
                .pipe(
                    takeUntil(this.destroy$)
                )
                .subscribe((resultUpdateTopic) => {
                    const dataSource = resultUpdateTopic.data.updateTopic;
                    topic.text = dataSource.name;
                    topic.editMode = false;
                }
                );
        }
    }

    addUserStoryInTopic(topic: Topic): void {
        const userStory = new UserStory();
        userStory.editMode = true;
        // TODO use topic.id when migrating the US to agile
        userStory.topicId = topic.id;
        userStory.productId = topic.product.productId;
        topic.userStories.unshift(userStory);
    }
    addComment(): void {
        this.addCommentMode = true;
        this.commentsExpanded = true;
        this.expanded = true;
    }
    onClick() {
        if (this.topic?.id) {
            this.nofiy.emit(this.topic);
        }
    }


    get appChatUrl(): string {
        return this.helper.getChatUrl(this.topic?.ticketId);
    }
}
