import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SprintService, DailyScrumService, SocketioService, UserService, UserStoryService } from '../../services/index';
import * as moment from 'moment';
import { Subject, interval } from 'rxjs';
import { Observable, Subscription } from 'rxjs';
import 'moment-duration-format';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';


import { finalize, map, takeUntil } from 'rxjs/operators';
import { DailyScrumGrapgQlService } from '../../services/pts-api/agile/daily-scrum.service';
import { DailyScrum } from '../../models/daily-scrum.model';
import { Sprint } from '../../models/sprint.model';
import { DsParticipantGraphQlService } from '../../services/pts-api/agile/ds-participant.service';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { SprintMemberGraphQlService } from '../../services/pts-api/agile/sprint-member.service';
import { HelperService } from '../../shared/services/helper/helper.service';
import { Speaker } from '../../models/speaker.model';

@Component({
    selector: 'app-dashboard-header',
    templateUrl: './dashboard-header.component.html'
})

export class DashboardHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
    serverpath: string = 'https://pts.thinktank.de/';
    productid;
    currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
    currentUserCode: string = JSON.parse(sessionStorage.currentUser).usercode;
    currentUserPhoto: string;
    dsModerator: string;

    dsId: number = null;
    dsPartId: number = null;
    dsPartcipantId: number = null;
    dsStarted: boolean = false;
    isTalking: boolean = false;
    isLeft: boolean = false;
    canSpeaking: boolean = false;
    isUserSpeaking: boolean = false;
    speaker: Speaker = { id:-1, code:'', userId : null};

    loading: boolean;
    @Output() userStatusUpdateLoadingChange = new EventEmitter<boolean>();
    @Input() userStatusUpdateLoading: boolean;
    @Input() sprintId: any;
    btnTextStart: string = 'Start DS';
    btnTextStop: string = 'Finish DS';
    btnTextDsState: string;

    subscription: Subscription;
    observable: Observable<any>;

    // timer
    public diffstr: string = '00:00:00';
    public deadlineReached = false;

    isSM_SMD_By_Product: boolean;
    isSM_SMD_By_Sprint: boolean;
    sprintSm: boolean;

    productId: number;

    dailyScrum: DailyScrum;
    sprint: Sprint;
    product: any;
    sprintProgress: any;

    @ViewChild(ToastContainerDirective, { static: true })
    toastContainer: ToastContainerDirective;

    destroy$ = new Subject();
    dsParticipant: any;
    chatUrl: string;
    constructor(private sprintService: SprintService,
        public dailyScrumService: DailyScrumService,
        public dailyScrumGrapgQlService: DailyScrumGrapgQlService,
        public productService: ProductService,
        public userStoryService: UserStoryService,
        private socketservice: SocketioService,
        private userService: UserService,
        private dsParticipantGrapgQlService: DsParticipantGraphQlService,
        private sprintGrapgQlService: SprintGrapgQlService,
        public toastr: ToastrService,
        private sprintMemberGrapgQlService: SprintMemberGraphQlService,
        private helper: HelperService) {

    }

    ngAfterViewInit(): void {
        this.toastr.overlayContainer = this.toastContainer;
    }

    ngOnInit() {
        this.initData();
        // this.userService.getUserRoleBySprint(this.currentUserId, +this.sprintId).subscribe((user) => {
        //     if (user && user.length > 0) {
        //         this.currentUserPhoto = user[0].photo;
        //     }
        // });
        this.socketservice.getDsNotification('ds-start')
        .pipe(takeUntil(this.destroy$))
        .subscribe(notification => {

            if (+this.sprintId === +JSON.parse(JSON.stringify(notification)).text.sprint) {

                this.dsId = +JSON.parse(JSON.stringify(notification)).text.ds;

                const startTime: Date = new Date(JSON.parse(JSON.stringify(notification)).text.startTime);
                this.dsStarted = true;
                this.btnTextDsState = this.btnTextStop;
                this.startTimer(startTime);
                this.isTalking = false;
                this.canSpeaking = true;
                const dsParticipantInputData = {
                    userId: this.currentUserId,
                    userCode: this.currentUserCode,
                    dailyScrumId: this.dsId,
                    stateId: 1017909
                };
                this.dsParticipantGrapgQlService.createDsParticipant(dsParticipantInputData)
                    .subscribe(
                        (data) => {

                            this.dsPartId = +data.data.createDsParticipant.id;
                            this.dsParticipant = data.data.createDsParticipant;
                            this.socketservice.newUserNotification(+data.data.createDsParticipant.userId, data.data.createDsParticipant.userCode, +this.dsId, +this.sprintId);
                        },  // changed
                        (err) => {
                            console.log('error', err);
                        },
                        () => console.log('Done')
                    );
            }
        });


        this.socketservice.getDsNotification('ds-finished')
        .pipe(takeUntil(this.destroy$))
        .subscribe(notification => {
            if (+this.sprintId === +JSON.parse(JSON.stringify(notification)).text.sprint) {
                this.dsId = null;
                this.dsStarted = false;
                this.stopTimer();
                this.isTalking = false;
                this.canSpeaking = false;
                this.btnTextDsState = this.btnTextStart;
                this.onSelectedSpeaker(this.isUserSpeaking, this.speaker);
            }
        });


        this.socketservice.getNewUserTalking()
        .pipe(takeUntil(this.destroy$))
        .subscribe(notification => {

            const userId: number = +JSON.parse(JSON.stringify(notification)).text.user;
            const state: string = JSON.parse(JSON.stringify(notification)).text.state;
            const sprintId: number = +JSON.parse(JSON.stringify(notification)).text.sprintId;
            if (+this.sprintId === +sprintId) {
                if (this.currentUserId !== userId) {
                    if (state === 'Speaking') {
                        this.canSpeaking = false;
                        this.isTalking = false;
                    } else {
                        this.canSpeaking = true;
                        this.isTalking = false;
                    }
                } else {
                    if (state === 'Speaking') {
                        this.canSpeaking = true;
                        this.isTalking = true;
                    } else {
                        this.canSpeaking = true;
                        this.isTalking = false;
                    }
                }

            }
        });

        if (this.dsStarted) {
            this.btnTextDsState = this.btnTextStop;

        } else {
            this.btnTextDsState = this.btnTextStart;
            this.dsId = null;

        }

    }


    ngOnDestroy(): void {
        this.destroy$.next(undefined);
        this.destroy$.complete();
    }

    private dsSendNotification(dsId: number, sprintId: number, state: string, startTime?: Date) {
        this.socketservice.dsSendNotification(dsId, sprintId, state, startTime);
        console.log('notification DS STATE CHANGED to : ', state, dsId, sprintId, startTime);
    }

    startDs(sprintId: number) {
        this.loading = true;
        this.dailyScrumGrapgQlService.startedDailyScrumBySprintId(+this.sprint.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(result => {
                if (!result?.data?.startedDailyScrumBySprintId) {
                    this.loading = true;

                    const dsInputData = {
                        sprintId: this.sprint.id,
                        startedAt: moment(new Date().getTime()).format('YYYY-MM-DDTHH:mm:ss'),
                        stateId: 1017898 // Created :: TODO get Start Status from PTS by Type
                    };

                    this.dailyScrumGrapgQlService.createDailyScrum(dsInputData)
                        .pipe(takeUntil(this.destroy$),
                            finalize(() => this.loading = false))
                        .subscribe(result => {
                            if (result) {
                                const ds = result?.data?.createDailyScrum;
                                this.dsSendNotification(ds.id, +this.sprintId, 'ds-start', new Date(ds.startedAt));
                                this.dsStarted = true;
                                this.dsModerator = ds.creator;
                            }
                        });

                } else {
                    const dataSource = result.data.startedDailyScrumBySprintId;
                    this.dailyScrum = dataSource;
                    this.calculateDSendTime();

                    this.loading = true;
                    this.sprintGrapgQlService.getSprintProgress(this.sprint.id).subscribe(
                        (progress) => {
                            this.sprintProgress = Math.floor(progress.data.getSprintProgress * 100);
                            const dsInputData = {
                                finishedAt: moment(new Date().getTime()).format('YYYY-MM-DDTHH:mm:ss'),
                                sprintProgress: +progress.data.getSprintProgress * 100,
                                stateId: 1017899 // Created :: TODO get Finish Status from PTS by Type
                            };
                            this.dailyScrumGrapgQlService.updateDailyScrum(+this.dailyScrum.id, dsInputData)
                                .pipe(takeUntil(this.destroy$),
                                    finalize(() => this.loading = false))
                                .subscribe(result => {
                                    this.dsStarted = false;
                                    const ds = result?.data?.updateDailyScrum;

                                    this.dsSendNotification(ds.id, +this.sprintId, 'ds-finished');
                                    this.onSelectedSpeaker(this.isUserSpeaking, this.speaker);
                                });

                        });

                    console.log('changing dsStarted to false');
                }
            });
    }

    talking(dsPartId: number) {

        this.userStatusUpdateLoading = true;
        this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
        console.log('Talking dsPartId : ', dsPartId);
        if (this.dsStarted) {
            if (dsPartId != null) {
                if (!this.isTalking) {
                    const dsParticipantInputData = {
                        stateId: 1017911 //speaking 
                    };
                    this.dsParticipantGrapgQlService.updateDsParticipant(this.dsPartId, dsParticipantInputData).subscribe(

                        //  this.userService.updateUserState(dsPartId, 'Speaking', +this.currentUserId).subscribe(

                        (data) => {
                            this.userStatusUpdateLoading = false;
                            this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
                            console.log('Ds USER state changed : ', this.sprint.ticketId, data.data.updateDsParticipant.stateId);
                            //this.newUserTalking(+data.data.responsibleId, data.data.responsibleView, 'Speaking', this.dsId, +this.sprintId);
                            this.newUserTalking(+data.data.updateDsParticipant.userId, data.data.updateDsParticipant.userCode, 'Speaking', this.dsId, +this.sprint.ticketId);
                            this.speaker.code = data.data.updateDsParticipant.userCode;
                            this.speaker.id = data.data.updateDsParticipant.id;
                            this.speaker.userId = data.data.updateDsParticipant.userId;

                        },
                        (err) => {
                            this.userStatusUpdateLoading = false;
                            this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
                            console.log('errororororor', err);
                        },
                        () => console.log('Done')
                    );
                } else {
                    const dsParticipantInputData = {
                        stateId: 1017909 //Joined 
                    };
                    this.dsParticipantGrapgQlService.updateDsParticipant(this.dsPartId, dsParticipantInputData).subscribe(
                        // this.userService.updateUserState(dsPartId, 'Joined', +this.currentUserId).subscribe(
                        (data) => {
                            this.userStatusUpdateLoading = false;
                            this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
                            console.log('Ds USER state changed : ', data.data.updateDsParticipant.ticketId, data.data.updateDsParticipant.stateId);
                            console.log('id talking user: ', data.data.updateDsParticipant.userId,);
                            this.newUserTalking(+data.data.updateDsParticipant.userId, data.data.updateDsParticipant.userCode, 'Joined', this.dsId, +this.sprint.ticketId);
                            this.isUserSpeaking = false;
                            this.speaker.code = '';
                            this.speaker.id = -1;
                            this.speaker.userId = null;
                            this.onSelectedSpeaker(this.isUserSpeaking, this.speaker);
                        },
                        (err) => {
                            this.userStatusUpdateLoading = false;
                            this.userStatusUpdateLoadingChange.emit(this.userStatusUpdateLoading);
                            console.log('errororororor', err);
                        },
                        () => console.log('Done')
                    );
                }

            } else {
                alert('No Ds user state created');
            }
        } else {
            alert('Daily scrum not start');
        }
    }


    private left(dsPartId: number) {
        const dsParticipantInputData = {
            stateId: 1017910 //left
        };
        if (this.dsStarted) {
            if (dsPartId != null) {
                if (!this.isTalking) {
                    this.dsParticipantGrapgQlService.updateDsParticipant(this.dsPartId, dsParticipantInputData).subscribe(
                        //this.userService.updateUserState(dsPartId, 'Left', +this.currentUserId).subscribe(
                        (data) => {
                            console.log('Ds USER state changed : ', data.data.updateDsParticipant.ticketId, data.data.updateDsParticipant.stateId);
                            this.newUserTalking(+data.data.updateDsParticipant.userId, data.data.updateDsParticipant.userCode, 'Left', this.dsId, +this.sprint.ticketId);
                        },
                        (err) => {
                            console.log('error', err);
                        },
                        () => console.log('Done')
                    );
                } else {
                    this.toastr.info('disable taking button', null,
                        { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true });
                }
            } else {
                // this.router.navigate(['/login']);
            }
        } else {
            // this.router.navigate(['/login']);
        }
    }



    private newUserTalking(idUser: number, userCode: string, state: string, dsId: number, sprintId: number) {
        this.socketservice.sendNewUserTalking(idUser, userCode, state, dsId, sprintId);
    }



    // timer
    private startTimer(eventDate: Date) {
        this.subscription = interval(1000).pipe(map((x) => { })).subscribe((x) => {
            const diffmill = Math.floor(new Date().getTime() - eventDate.getTime());
            this.diffstr = moment.duration(diffmill).format('hh:mm:ss', { trim: false });
            if (!this.deadlineReached && (diffmill / 60000) > this.sprint.dsDuration) {
                this.deadlineReached = true;
            }
        });

    }
    private stopTimer() {
        if (this.subscription != null) {
            this.diffstr = '00:00:00';
            this.deadlineReached = false;
            this.subscription.unsubscribe();
        }
    }

    isScrumMasterOrScrumMasterDeputyByProduct(productId: number) {
        this.userService.getListScrumMasterAndScrumMasterDeputyByProduct(productId).subscribe(data => {

            if (data.length > 0) {
                data.forEach(element => {
                    if (element.user_id === this.currentUserId) {
                        this.isSM_SMD_By_Product = true;
                    }
                });
            } else {
                console.log('no SM/SMD available');
                this.isSM_SMD_By_Product = false;
            }

        });

    }

    isScrumMasterOrScrumMasterDeputyBySprint(sprintId: number) {
        this.userService.getListScrumMasterAndScrumMasterDeputyBySprint(sprintId).subscribe(data => {

            if (data.length > 0) {
                data.forEach(element => {
                    if (element.responsible_id === this.currentUserId) {
                        this.isSM_SMD_By_Sprint = true;
                    }
                });

            } else {
                console.log('no SM/SMD available');
                this.isSM_SMD_By_Sprint = false;
            }

        });

    }

    onSelectedSpeaker(isUserSpeaking, speaker:Speaker) {

        this.userStoryService.setIsUserSpeaking(isUserSpeaking, speaker);
    }


    /******************************************** */
    /*             Private methods                */
    /******************************************** */

    private initData() {

        this.sprintGrapgQlService.getSprintDetailsByTicketId(+this.sprintId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(sprintData => {
                if (sprintData.data) {
                    this.sprint = sprintData.data.getSprintDetailsByTicketId;

                    this.dailyScrumGrapgQlService.startedDailyScrumBySprintId(+this.sprint.id)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe((startedDailyScrumBySprintId) => {

                            if (startedDailyScrumBySprintId?.data?.startedDailyScrumBySprintId) {
                                const dataSource = startedDailyScrumBySprintId.data.startedDailyScrumBySprintId;
                                this.dailyScrum = dataSource;
                                this.dsModerator = dataSource.creator;
                                this.handelStartedDs();
                            }
                        });

                    this.getSprintProgressFromMyDailyScrums();
                    this.loadSprintSm();
                    this.calculateDSendTime();

                    // this.isScrumMasterOrScrumMasterDeputyBySprint(+this.sprint.ticketId);
                    // this.isScrumMasterOrScrumMasterDeputyByProduct(+this.sprint.productId);

                    //Load product from pts core
                    this.getListProductById();

                }
            }, (error) => {
                console.log('faild to get sprintDetail from sprint parent', error);
            });

    }

    private getListProductById() {
        this.productService.getListProductById(this.sprint.productId).subscribe(response => {
            if (response?.length > 0) {
                this.product = response[0];
            }
        });
    }

    private handelStartedDs() {
        if (this.dailyScrum?.id) {
            this.dsId = this.dailyScrum.id;
            this.dsStarted = true;
            //TODO
            // this.dsModerator = ds[0].moderator;
            this.btnTextDsState = this.btnTextStop;
            // start the timer

            this.startTimer(new Date(this.dailyScrum.startedAt));

            // this.userService.getCurrentUserState(this.currentUserId, this.dailyScrum.ticketId).subscribe(state => {

            //     if (state.length === 0) {
            //Create new ds participant only when the current user not part of ds.dsParticipants 
            this.dsParticipant = this.dailyScrum?.dsParticipants.find(e => e.userId === this.currentUserId)
            if (!this.dsParticipant) {
                // create user
                // send notification user joined
                const dsParticipantInputData = {
                    userId: this.currentUserId,
                    userCode: this.currentUserCode,
                    dailyScrumId: this.dsId,
                    stateId: 1017909

                };

                this.dsParticipantGrapgQlService.createDsParticipant(dsParticipantInputData).subscribe(
                    (data) => {
                        this.dsPartId = +data.data.createDsParticipant.id;
                        //this.dsParticipant = data.data.createDsParticipant;
                        this.socketservice.newUserNotification(+data.data.createDsParticipant.userId, data.data.createDsParticipant.userCode,
                            +this.dsId, +this.sprintId);
                    },  // changed
                    (err) => { console.log('error', err); },
                    () => console.log('Done')
                );
            } else {
                this.dsPartId = this.dsParticipant.id
                if (this.dsParticipant.stateId === 1017911) { // if isSpeaking
                    this.isTalking = true;
                } else if (this.dsParticipant.stateId === 1017909) { // if isJoined
                    this.isTalking = false;
                } else if (this.dsParticipant.stateId === 1017910) { // if isLeft
                    // change state to joined
                    const dsParticipantInputData = {
                        stateId: 1017909
                    };
                    this.dsParticipantGrapgQlService.updateDsParticipant(this.dsPartId, dsParticipantInputData).subscribe(
                        (data) => {
                            this.socketservice.newUserNotification(
                                data.data.updateUserState.userId,
                                data.data.updateUserState.userCode,
                                this.dsId,
                                +this.sprintId);
                        },
                        (err) => { console.log('errororororor', err); },
                        () => console.log('Done')
                    );
                }
            }

            // });

            this.userStoryService.speaker$.subscribe((speaker) => {
                if (this.speaker) {
                    this.speaker = speaker;
                    if (this.speaker ?.id !== -1) {
                        if (this.speaker.userId === this.currentUserId) {
                            this.canSpeaking = true;
                        } else {
                            this.canSpeaking = false;
                        }
                    } else {
                        this.canSpeaking = true;
                    };
                }
            });


        } else {
            // stop the timer
            this.stopTimer();
            this.dsId = null;
            this.dsStarted = false;
        }


    }

    private getSprintProgressFromMyDailyScrums(): void {
        let productIds = [this.sprint.productId];
        this.dailyScrumGrapgQlService.myDailyScrums(productIds).subscribe(dataSource => {
            let myDailyScrums: any[] = dataSource?.data?.myDailyScrums?.items;
            let mySprintDailyScrums = myDailyScrums.filter(ds => (ds.sprintId == this.sprint.id) && ds.dsFinishedAt);
            mySprintDailyScrums.length ? this.sprintProgress = mySprintDailyScrums[0].sprintProgress : this.sprintProgress = 0;
        });
    }

    private calculateDSendTime() {
        this.sprint.appDsEndTime = new Date();
        const hour = this.sprint.dsStartTime.substring(0, 2);
        const minutes = this.sprint.dsStartTime.substring(3, 5);
        const seconds = this.sprint.dsStartTime.substring(6, 8);

        this.sprint.appDsEndTime.setHours(+hour);
        this.sprint.appDsEndTime.setMinutes(+minutes);
        this.sprint.appDsEndTime.setSeconds(+seconds);

        this.sprint.appDsEndTime = moment(this.sprint.appDsEndTime).add(moment.duration(this.sprint.dsDuration, 'minutes'));
    }

    private loadSprintSm() {
        const input = {
            sprintId: this.sprint.id,
            stateId: 1030058 // sprintMmeber status ON
        };
        this.sprintMemberGrapgQlService.filterSprintMembers(input).subscribe(users => {
            const sprintMembers = users.data.filterSprintMembers.items;
            if (sprintMembers.length > 0) {

                // load current user photo
                this.userService.getCurrentUser().subscribe(dataSource => {
                    const currentMembers = sprintMembers.filter((element) => { return element.userCode === dataSource[0].user_code });

                    if (currentMembers && currentMembers.length > 0) {
                        this.getCurrentUserPhoto();

                        const smOrSmd = currentMembers.find((element) => { return element.role === 'Scrum master' || element.role === 'Scrum master Deputy' });
                        console.log(smOrSmd)
                        if (smOrSmd) {
                            this.isSM_SMD_By_Sprint = true;

                        } else {
                            this.isScrumMasterOrScrumMasterDeputyByProduct(+this.sprint.productId)
                        }
                    }
                });

                //Get scrum master code 
                const scrumMaster = sprintMembers.find((element) => { return element.role === 'Scrum master' })
                if (scrumMaster) {
                    this.sprintSm = scrumMaster.userCode;

                }
            }

        },
            err => {
                console.log('Something went wrong!', err);
            }
        );
    }

    private getCurrentUserPhoto(): void {

        this.productService.getProductBySprintsId(this.sprint.ticketId).subscribe(data => {
            this.userService.getproductTeam(data[0].name).subscribe(result => {
                const member = result.find(item => item.user_id === this.currentUserId);
                this.currentUserPhoto = member?.photo;
            })
        })
    }

    get appSprintChatUrl(): string {
        return this.helper.getChatUrl(this.sprint?.ticketId);
    }
}
