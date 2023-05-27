/* eslint-disable eqeqeq */
import { Component, OnInit, OnDestroy, Input, ViewContainerRef } from '@angular/core';
import { DragulaService, DragulaOptions } from 'ng2-dragula';
import { Router, ActivatedRoute } from '@angular/router';

import { Topic } from '../../models/topic.model';
import { UserStory } from '../../models/user-story.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { SprintService } from '../../services/sprint.service';
import { ProjectService } from '../../services/project.service';

import { UserStoryService } from '../../services/userstory.service';
import { StateService } from '../../services/state.service';
import { TopicOption } from '../../models/topic-optionmulti.model';
import { Sprint } from '../../models/sprint.model';
import { BackLogCsv } from '../../models/backlogcsv.model';
import { DatePipe } from '@angular/common';
import { State } from '../../models/state.model';
import { StateOption } from '../../models/status-optionmulti.model';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { TopicGrapgQlService } from '../../services/pts-api/agile/topic.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { Urgency } from '../../models/urgency.model';
import { PrioService } from '../../services/prio.service';
import { Task } from '../../models/task.model';

declare let alasql;


interface CustomDragulaOptions<T = any> extends DragulaOptions<T> {
    moves?: (el: Element, container: Element, handle: Element) => boolean;
}


@Component({
    selector: 'app-root',
    templateUrl: './managment-us.template.html',
    styleUrls: ['../../../assets/font/ds-digib-webfont.css'
        , '../../../assets/css/lib/font-awesome/font-awesome.min.css'
        , '../../../assets/font/opensans-regular.css'
        , '../../../assets/css/lib/bootstrap/bootstrap.min.css'
        , '../../../assets/css/ds.css'
        , '../../../assets/font/daily-scrum.css'
        , '../../../assets/css/media-queries.css']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ManagmentUS implements OnInit, OnDestroy {

    isClickable = true;
    topicSubject: number;
    editTopicMode: boolean = false;
    private PRODUCT_ID: number;
    private selectedTopic: any;
    private USER_STORY_TYPE = 1017760;
    private Current_USER: number;
    topics: any[] = [];
    myProduct: Product;
    products: Product[] = [];
    dropdownList = [];
    sprintFilterOptions: Array<Sprint> = [];
    dropdownListProject: Product[] = [];
    dropdownListState = [];
    selectedItems = [];
    dropdownSettings = {};
    sprintOptions: Sprint[] = [];
    filterargs: Array<Topic> = [];
    userStoryStrSearch: string = '';
    strSearchinput: string = '';
    sprintFilterSelected = null;
    projectNameSelected: string = '0';
    private csvList: any[] = [];
    displayInput: boolean = false;
    htmlText: string;
    ustopicSubject: number;
    usId: number;
    private stateNameSelected: '0';
    private sprintId: number;
    private dropSubscription: Subscription;
    loading: boolean;
    allStatusDropdownSettings = {};
    selectedStateItems = [];
    private dragSubscription: Subscription;
    activate: boolean = true;
    usList: any[] ;
    @Input() currentUser: any;
    currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
    nonAssignedUserStories: UserStory[] = [];
    listUrgency: Urgency[] = [];
    assigned_tickets_number:number;
    destroy$ = new Subject();
    constructor(
        private stateService: StateService,
        private projectService: ProjectService,
        private sprintService: SprintService,
        private dragulaService: DragulaService,
        private productService: ProductService,
        private topicGrapgQlService: TopicGrapgQlService,
        private sprintGrapgQlService: SprintGrapgQlService,
        private userStoryGrapgQlService:UserStoryGrapgQlService,
        private userStoryService: UserStoryService,
        private route: ActivatedRoute,
        public toastr: ToastrService,
        private prioService:PrioService) {
        const bag: any = this.dragulaService.find('DRAGULA_TOPICS');
        if (bag !== undefined) { this.dragulaService.destroy('DRAGULA_TOPICS'); }
        const bag2: any = this.dragulaService.find('DRAGULA_USS');
        if (bag2 !== undefined) { this.dragulaService.destroy('DRAGULA_USS'); }
        const options: CustomDragulaOptions = {
            copySortSource: false,
            moves: function (el, container, handle) {
                return handle.className === 'user-storie-topic'
                    || handle.className === 'storie-text'
                    || handle.className === 'postit-progress'
                    || handle.className === 'part-top'
                    || handle.className === 'user-storie-global-topic'
                    || handle.className === 'part-middle'
                    || handle.className === 'postit-toolbar'
                    || handle.className === 'ust-number'
                    || handle.className === 'ust-icons'
                    || handle.className === 'postit-close-circle';
            }
        };
        const options2: CustomDragulaOptions = {
            copySortSource: false,
            moves: function (el, container, handle) {
                return handle.className === 'postit-container'
                    || handle.className === 'postit-header'
                    || handle.className === 'postit-title'
                    || handle.className === 'postit-global-block'
                    || handle.className === 'postit-text'
                    || handle.className === 'postit-text mx-1'
                    || handle.className === 'postit-header'
                    || handle.className === 'postit-status'
                    || handle.className === 'postit-info'
                    || handle.className === 'add-comment'
                    || handle.className === 'user-resp-values-task'
                    || handle.className === 'postit-close-circle';
            }
        };
        dragulaService.createGroup('DRAGULA_TOPICS', options);
        dragulaService.createGroup('DRAGULA_USS', options2);

        this.dragSubscription = dragulaService.drag().subscribe((value) => {
            this.onDragModel(value, this.currentUser);
        });

        this.dropSubscription = dragulaService.dropModel().subscribe((value) => {
            this.onDropModel(value);
        });
    }

    ngOnInit(): void {

        this.route.params.subscribe(params => {
            this.PRODUCT_ID = params['id'];

        });
        this.getListProduct();
        this.getListUrgency();
        this.getListOfTopicByProduct();
        this.getListState();
        this.getUSByProductIdWithoutTopic();
        this.dropdownSettings = {
            singleSelection: false,
            text: 'Topics',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            classes: 'fontawesome',
            badgeShowLimit: 0
        };
        this.allStatusDropdownSettings = {
            singleSelection: false,
            text: 'All Status',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            classes: 'fontawesome',
            badgeShowLimit: 0
        };
      
    }

    ngOnDestroy(): void {
        this.dropSubscription.unsubscribe();
        this.destroy$.next(undefined);
        this.destroy$.complete();
    }

    toogleDisplayInput(): void {
        this.displayInput = !this.displayInput;
    }

    ShowDetail(userStory: UserStory): void {


        this.usId = userStory.id;
        this.sprintId = userStory.sprintId;
        this.ustopicSubject = userStory.topicId;

    }

    hideDetail(): void {
        this.usId = null;
        this.sprintId = null;
        this.ustopicSubject = null;

    }

    onSearchUserStory() {
        this.filterargs = this.selectedItems;
        this.strSearchinput = this.userStoryStrSearch;
        //this.filterArgsState = this.selectedStateItems;
    }


    onItemSelect(item: any) {
        this.filterargs = this.selectedItems;
        this.strSearchinput = this.userStoryStrSearch;

    }

    OnItemDeSelect(item: any) {
        this.strSearchinput = this.userStoryStrSearch;
        this.filterargs = this.selectedItems;


    }

    onSelectAll(items: any) {
        this.strSearchinput = this.userStoryStrSearch;
        this.filterargs = this.selectedItems;
    }

    onDeSelectAll(items: any) {
        this.strSearchinput = this.userStoryStrSearch;
        this.filterargs = [];
        const obj = new Topic();
        obj.id = 1;
        obj.text = 'DeSelectAll';
        this.filterargs.push(obj);
    }

    // get List of Topic by product
    private getListOfTopicByProduct(): void {
        this.loading = true;
        this.topicGrapgQlService.getTopicsByProductId(this.PRODUCT_ID)
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((result) => {
                const topics = result.data.topicsByProductId.items;
                topics.forEach((data, index) => {
                    const topic = new Topic();
                    topic.id = data.id;
                    topic.text = data.name;
                    topic.order = data.displayOrder;
                    topic.ticketId = data.ticketId;
                    topic.chat_url = data.chat_url;

                    const product = new Product();  
                    product.productId  = data.productId
                    topic.product  = product; 
                    

                    this.topics.push(topic);
                    // TODO use topic.id when migrating the US to agile :done
                    if (topic.id) {
                        // TODO use topic.id when migrating the US to agile :done
                        this.userStoryGrapgQlService.getUserStoriesByTopicId(topic.id)
                            .subscribe((userStories) => {
                                // push next userStory
                                this.usList = userStories.data.getUserStoriesByTopicId.items;
                                if (this.usList.length !== 0) {
                                    for (const tsItem of this.topics) {

                                        for (const usItem of this.usList) {
                                            const topic_Id = usItem.topic.id;
                                            const topic_name = usItem.topic.name;
                                            // TODO use tsItem.id when migrating US to agile :done
                                            if (usItem.topic.id == tsItem.id) {
                                                const userStory = new UserStory();
                                                const cellCsv = new BackLogCsv();

                                                cellCsv['Topic id'] = tsItem.topic_Id;
                                                cellCsv['Topic name'] = tsItem.topic_name;

                                                if (usItem.id !== undefined) {
                                                    userStory.id = usItem.id;
                                                    cellCsv['US id'] = usItem.id;
                                                }

                                                if (usItem.shortDescription !== undefined) {
                                                    userStory.shortDescription = usItem.shortDescription;
                                                    cellCsv['US short description'] = usItem.shortDescription;
                                                }

                                                if (usItem.topic !== undefined) {
                                                    userStory.topic = usItem.topic;
                                                }
                                             
                                                if (usItem.userCode !== undefined) {
                                                    userStory.userCode = usItem.userCode;
                                                    cellCsv['Responsible'] = usItem.userCode;
                                                }

                                                if (usItem.stateId !== undefined) {
                                                    userStory.state =  this.dropdownListState.find(state => state.id == usItem.stateId)?.itemName;
                                                    cellCsv['State'] = usItem.stateId;
                                                }
                                                if (usItem.productId !== undefined) {
                                                    userStory.productId = usItem.productId;
                                                }
                                                if (usItem.storyPoints !== undefined) {
                                                    userStory.storyPoints = usItem.storyPoints;
                                                    cellCsv['Story points'] = usItem.storyPoints;
                                                }

                                                if (usItem.urgencyId !== undefined) {
                                                    userStory.urgencyId = usItem.urgencyId;
                                                    userStory.urgencyIcon = this.listUrgency.find(urgency => urgency.urgencyId == usItem.urgencyId)?.urgencyIcon;
                                                }

                                                if (usItem.progress !== undefined) {
                                                    userStory.progress = usItem.progress;
                                                    cellCsv['Progress'] = usItem.progress;
                                                }

                                                if (usItem.orderByTopic !== undefined) {
                                                    userStory.orderByTopic = usItem.orderByTopic;
                                                    cellCsv['Order in Topic'] = usItem.orderByTopic;
                                                }

                                               if (usItem.sprint !== undefined) {
                                                    userStory.sprint  = usItem?.sprint ;
                                                    cellCsv['Sprint name'] = usItem?.sprint?.name ;
                                                }

                                                if (usItem.feature !== undefined) {
                                                    userStory.feature  = usItem?.feature ;
                                                    
                                                }
                                                if (usItem.project !== undefined) {
                                                    userStory.project = usItem.project;
                                                    cellCsv['Project'] = usItem.project;
                                                }
                                                userStory.topic.name = usItem.topic.name;
                                                userStory.chat_url = usItem.chat_url;
                                                userStory.ticketId = usItem.ticketId;
                                                tsItem.userStories.push(userStory);
                                                this.csvList.push(cellCsv);
                                            }
                                        }
                                    }
                                }

                                if (index === topics.length - 1) {
                                    this.loading = false;
                                }
                            },
                                (err) => {
                                    console.log('Something went wrong!', err);
                                    if (index === topics.length - 1) {
                                        this.loading = false;
                                    }
                                });
                    }
                });
                this.dropdownList = (this.topics || []).map(item => ({
                    id: item.id,
                    itemName: item.text
                }));

            },
                (err) => {
                    console.log('Something went wrong!', err);
                    this.loading = false;
                }
            );
    }

    // get List of Sprint by product
    private getListOfSprintByProduct(): void {
        this.sprintGrapgQlService.getSprintsByProductId(this.PRODUCT_ID)
            .subscribe(result => {

                this.sprintOptions = (result.data.getSprintsByProductId.items || []).map(item => ({
                    sprintId: item.id,
                    name: item.name || item.id,
                    ticketId: item.ticketId
                }));
            });
    }

    // add new Topic
    addTopic(): void {
        const product = new Product();
        product.productId = this.myProduct.productId;
        product.productName = this.myProduct.productName;
        const topic = new Topic();
        topic.editMode = true;
        topic.product = product;
        this.topics.unshift(topic);
    }

    private onDropModel(args: any): void {
        this.loading = true;
        let prevOrd: number = 0, nextOrd: number = 0, newOrder: number = 0;
        if (args.name === 'DRAGULA_USS') {
            const parentTicketId = args.target.dataset.topicid;
            const userStoryId = args.el.dataset.userstoryid;

            if (parentTicketId) {
                const userStoryArry = args.target.children;

                for (let i = 0; i < userStoryArry.length; i++) {

                    if (userStoryArry[i]?.dataset.userstoryid == userStoryId) {


                        if (i > 0 && userStoryArry[i - 1] != undefined && userStoryArry[i - 1] != null) {
                            prevOrd = userStoryArry[i - 1].dataset.userstoryorder;
                        }
                        if (i < userStoryArry.length && userStoryArry[i + 1] != undefined && userStoryArry[i + 1] != null) {
                            nextOrd = userStoryArry[i + 1].dataset.userstoryorder;
                        }
                    }
                }
                if (prevOrd != 0 && nextOrd != 0) {
                    newOrder = (Number(prevOrd) + Number(nextOrd)) / 2;
                }

                if (prevOrd == 0 && nextOrd != 0) {
                    newOrder = Number(nextOrd) / 2;
                }

                if (prevOrd != 0 && nextOrd == 0) {
                    newOrder = Number(prevOrd) + 100;
                }
                if (prevOrd == 0 && nextOrd == 0) {
                    newOrder = 100;
                }
            }
            const userStoryInputData = {
                topicId: parentTicketId || null,
                orderByTopic: parentTicketId ? newOrder.toFixed() : null
            };

            this.userStoryGrapgQlService.updateUserStory(userStoryId, userStoryInputData)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((resultUpdateUS) => {
                    const dataSource = resultUpdateUS.data.updateUserStory;
                    args.el.dataset.userstoryorder = dataSource.orderByTopic;
                });

        } else if (args.name === 'DRAGULA_TOPICS') {

            const topicSlectedId = args.el.dataset.topicid;
            const topicArry = args.targetModel;

            for (let i = 0; i < topicArry.length; i++) {

                if (topicArry[i].id == topicSlectedId) {

                    if (topicArry[i - 1] != undefined || topicArry[i - 1] != null) {
                        prevOrd = topicArry[i - 1].order;
                    }
                    if (topicArry[i + 1] != undefined || topicArry[i + 1] != null) {
                        nextOrd = topicArry[i + 1].order;
                    }
                }
            }
            if (prevOrd != 0 && nextOrd != 0) {
                newOrder = (prevOrd + nextOrd) / 2;
            }

            if (prevOrd == 0 && nextOrd != 0) {
                newOrder = nextOrd + 100;
            }

            if (prevOrd != 0 && nextOrd == 0) {
                newOrder = prevOrd / 2;
            }
            if (prevOrd == 0 && nextOrd == 0) {
                newOrder = 0;
            }
            const topicInputData = {
                displayOrder: newOrder.toFixed()
            };
            this.topicGrapgQlService.updateTopic(topicSlectedId, topicInputData)
                .pipe(
                    takeUntil(this.destroy$),
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((resultUpdateTopic) => {
                    const dataSource = resultUpdateTopic.data.updateTopic;
                    const selectedTopic = this.findTopicById(this.topics, topicSlectedId);
                    selectedTopic.order = dataSource.displayOrder;
                }
                );
        } else {
            this.loading = false;
            console.log('-- ERROR --!');
        }

    }
   
    private findTopicById(listOftopic: Topic[], tsId: any): any {

        for (let item = 0; item < listOftopic.length; item++) {
            if (listOftopic[item].id == tsId) {
                return listOftopic[item];
            }
        }
        return null;
    }
    private getListProduct(): void {

        this.productService.getListProductById(this.PRODUCT_ID)
            .subscribe(dataSource => {
                for (const data of dataSource) {
                    const product = new Product();
                    product.productId = data.product_id;
                    product.productName = data.product_name;
                    if (data.product_id == this.PRODUCT_ID) {
                        this.myProduct = new Product();
                        this.myProduct.productId = data.product_id;
                        this.myProduct.productName = data.product_name;
                        this.products.unshift(product);
                    } else {
                        this.products.push(product);
                    }
                }
                this.getListPoject();
                this.getListOfSprintByProduct();
            });
    }

    private getListPoject(): void {

        this.projectService.getAllProjectByProduct(this.myProduct.productId).subscribe(dataSource => {
            for (const data of dataSource) {
                const product = new Product();
                product.productId = data.project_id;
                product.productName = data.project_name;
                this.dropdownListProject.push(product);
            }
        });
    }
    private getListState(): void {

        this.stateService.getAllStatusOfUserStory()
            .pipe(map((dataSource: any) => dataSource.map(statusItem => {
                const statusOption = new StateOption();
                statusOption.id = statusItem.status_id;
                statusOption.itemName = statusItem.name;
                return statusOption;
            })))
            .subscribe(dataSource => {
                this.dropdownListState = dataSource;
            });
    }

    getProjectName(selectedProjectName: any) {

        this.filterargs = this.selectedItems;
        this.strSearchinput = this.userStoryStrSearch;
        this.projectNameSelected = selectedProjectName;
    }

    exportToCsvFile() {

        const prodactName = (this.myProduct.productName);
        const file_name = prodactName.replace(/ /g, '_') + '_' + new DatePipe('en-US').transform(new Date(), 'yyyyddMM') + '.xlsx';

        const mystyle = {
            headers: true,
            column: { style: { Font: { Bold: '1', Color: '#636c72' } } }
        };
        alasql('SELECT * INTO XLSX(\'' + file_name + '\',?) FROM ?', [mystyle, this.csvList]);
    }

    private onDragModel(args: any, user: User): void {

        if (!this.activate) {
            this.toastr.error('Click to activate drag and drop'
                , null,
                { enableHtml: true, positionClass: 'toast-bottom-right', closeButton: true });
            this.dragulaService.find('DRAGULA_ASSIGNED_USS').drake.cancel(true);
        }
    }

    private getUSByProductIdWithoutTopic(): void {
        this.loading = true;
        this.userStoryGrapgQlService.getUserStoriesByProductIdWithoutTopic(this.PRODUCT_ID).subscribe(
            nonAssignedUserStories => {
                const nonAssignedUserStoriesGraphql=nonAssignedUserStories.data.getUserStoriesByProductIdWithoutTopic.items;
                this.loading = false;
                this.nonAssignedUserStories = [];
                for (const response1 of nonAssignedUserStoriesGraphql) {
                    const nonAssignedUserStory = new UserStory();
                    nonAssignedUserStory.id = response1.id;
                    nonAssignedUserStory.state = this.dropdownListState.find(state => state.id == response1.stateId) ?.itemName;
                    nonAssignedUserStory.userCode = response1.userCode;
                    nonAssignedUserStory.shortDescription = response1.shortDescription;
                    nonAssignedUserStory.urgencyId = response1.urgencyId;
                    nonAssignedUserStory.urgencyIcon = this.listUrgency.find(urgency => urgency.urgencyId == response1.urgencyId)?.urgencyIcon;
                    nonAssignedUserStory.progress = response1.progress;
                    nonAssignedUserStory.storyPoints = +response1.storyPoints;
                    nonAssignedUserStory.project = response1.project; 
                    nonAssignedUserStory.sprint = response1.sprint;
                    nonAssignedUserStory.chat_url = response1.chat_url;
                    nonAssignedUserStory.assignedTasketsNumber = response1.assigned_tickets_number;
                    nonAssignedUserStory.ticketId = response1.ticketId;

                    this.nonAssignedUserStories.push(nonAssignedUserStory);
                }

            },
            err => {
                this.loading = false;
                console.log('Something went wrong!', err);
            }
        );
    }
    ShowTopicDetail(topic: Topic): void {
        if (topic) {
            this.editTopicMode = true;
            this.topicSubject = topic.id;
        } else {
            this.topicSubject = null;
            this.editTopicMode = false;
        }
    }
    hideTopicDetail(): void {
        this.topicSubject = null;
        this.editTopicMode = false;
    }

    private getListUrgency(): void {

        this.prioService.getAllPrioOfUserStory().subscribe(dataSource => {
    
            const listUrgency: Urgency[] = [];
            for (const data of dataSource) {
                const urgencyCmb = new Urgency();
                urgencyCmb.urgencyId = data.urgency_id;
                urgencyCmb.urgencyIcon = data.icon;
                urgencyCmb.urgencyName = data.urgency_label;
                listUrgency.push(urgencyCmb);
            }
            this.listUrgency = listUrgency;
        });
    }

}
