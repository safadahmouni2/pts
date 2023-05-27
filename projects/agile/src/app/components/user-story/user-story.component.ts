import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UserStory } from '../../models/user-story.model';
import { UserService } from '../../services/user.service';
import { UserStoryService } from '../../services/userstory.service';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { Topic } from '../../models/topic.model';
import { Subject } from 'rxjs';
import { Speaker } from '../../models/speaker.model';
import { HelperService } from '../../shared/services/helper/helper.service';
@Component({
    selector: 'app-user-story',
    templateUrl: './user-story.component.html',
    styles: []
})
export class UserStoryComponent implements OnInit {
    isUserSpeaking: boolean = false;
    @Input() userStory: UserStory;
    @Input() speaker: Speaker;
    @Input() currentUser: any;
    // eslint-disable-next-line @angular-eslint/no-output-rename
    @Output('onShowDetail') nofiy: EventEmitter<UserStory> = new EventEmitter<UserStory>();
    topic: Topic;
    @Input() isClickable: boolean;
    @Input() PRODUCT_ID: number;
    destroy$ = new Subject();
    assignedTasksNumber: number;
    constructor(private userStoryService: UserStoryService,
        private userService: UserService,
        private userStoryGrapgQlService: UserStoryGrapgQlService,
        private helper: HelperService
    ) {

    }
    progressBarSubject: Subject<string> = new Subject();

    ngOnInit() {
        this.selectedUserSpeaker();

        this.progressBarSubject.pipe(debounceTime(250), distinctUntilChanged()).subscribe(progressValue => {

            const userStoryUpdateInput = {
                progress: progressValue,
                userCode: this.speaker.code,
                responsibleId: this.speaker.userId
            }

            this.userStoryGrapgQlService.updateUserStory(this.userStory.id, userStoryUpdateInput).subscribe(dataSource => {
                this.userStory.responsibleId = dataSource.data.updateUserStory.responsibleId;
                this.userStory.userCode = dataSource.data.updateUserStory.userCode;
                this.userStory.progress = +progressValue;
                this.selectedUserSpeaker();
            });
        });

    }
    selectedUserSpeaker() {
        this.userStoryService.selectedUserSpeaker$.subscribe((value) => {
            let isTestUserSpeaking = value;
            this.userStoryService.speaker$.subscribe((speaker) => {
                if (this.speaker) {
                    this.speaker.code = speaker.code;
                    this.speaker.id = speaker.id;
                    this.speaker.userId = speaker.userId;
                    this.isUserSpeaking = isTestUserSpeaking && (this.speaker.code == this.userStory.userCode);
                }
            });
        });
    }
    onClick() {
        this.nofiy.emit(this.userStory);
    }


    addUserStory(userStory: UserStory): void {
        let OrderDec, new_Order, max_Order, userStoryOrd, old_Ord: any;
        if (userStory.id == null) {
            this.userService.getCurrentUser().subscribe(currentUserData => {
                this.userStoryGrapgQlService.getUserStoryMaxOrder(userStory.topicId).pipe(
                    takeUntil(this.destroy$)
                ).subscribe(maxOrderData => {
                    max_Order = maxOrderData?.data?.getUserStoryMaxOrder;

                    if (max_Order !== null) {
                        new_Order = max_Order + 100;
                    } else {
                        new_Order = 100;
                    }
                    old_Ord = userStory.orderByTopic;
                    const userStoryInputData = {
                        topicId: userStory?.topicId,
                        productId: userStory.productId,
                        stateId: 1017772, //inital state: created
                        parentTicketId: userStory?.parentTicketId,
                        orderByTopic: userStory.id != null ? userStoryOrd = old_Ord : userStoryOrd = new_Order,
                        shortDescription: userStory._shortDescription
                    };
                    this.userStoryGrapgQlService.createUserStory(userStoryInputData)
                        .pipe(
                            takeUntil(this.destroy$)
                        ).subscribe((saveUserStoryResponse) => {
                            const dataSource = saveUserStoryResponse.data.createUserStory;
                            if (dataSource.orderByTopic != null || dataSource.orderByTopic === 0) {
                                OrderDec = dataSource.orderByTopic;
                            } else {
                                OrderDec = 0;
                            }
                            userStory.id = dataSource?.id;
                            userStory.ticketId = dataSource?.ticketId;
                            userStory.shortDescription = dataSource?.shortDescription;
                            userStory.topicId = dataSource?.topic?.id;
                            userStory.orderByTopic = OrderDec;
                            userStory.editMode = false;
                            userStory.state = 'Created' //inital state: created

                        });

                });
            });
        } else {
            const userStoryInputData = {
                shortDescription: userStory._shortDescription
            };
            if (this.isClickable) {
                this.userStoryGrapgQlService.updateUserStory(userStory.id, userStoryInputData)
                    .pipe(
                        takeUntil(this.destroy$),
                    )
                    .subscribe((resultUpdateUserStory) => {
                        const dataSource = resultUpdateUserStory.data.updateUserStory;
                        userStory.shortDescription = dataSource.shortDescription;
                        userStory.editMode = false;
                    }
                    );
            }

        }
    }

    onChangeProgress(event): void {
        if (!(this.currentUser && this.speaker.code
            || this.speaker.code === ''
            && (this.currentUser?.role.match('Scrum master') || this.speaker.code !== this.currentUser?.userCode))) {
            return;
        }

        this.progressBarSubject.next(event);
    }

    get appUserStoryChatUrl(): string {
        return this.helper.getChatUrl(this.userStory?.ticketId);
    }
    getTasks(ticketId: number) {
        this.userStory.toggleExpand();
        if (this.userStory.ticketId && this.userStory.expanded) {
            this.userStoryService.getAssignedTasks(ticketId).subscribe(tasks => {
                this.assignedTasksNumber = tasks.length;
            });
        }
    }
}
