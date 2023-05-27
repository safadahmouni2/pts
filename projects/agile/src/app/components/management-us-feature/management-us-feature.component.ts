/* eslint-disable eqeqeq */
import { Component, OnInit, OnDestroy, Input, ViewContainerRef } from '@angular/core';
import { DragulaService, DragulaOptions } from 'ng2-dragula';
import { Router, ActivatedRoute } from '@angular/router';

import { Feature } from '../../models/feature.model';
import { UserStory } from '../../models/user-story.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProjectService } from '../../services/project.service';

import { UserStoryService } from '../../services/userstory.service';
import { StateService } from '../../services/state.service';
import { FeatureOption } from '../../models/feature-optionmulti.model';
import { Sprint } from '../../models/sprint.model';
import { BackLogCsv } from '../../models/backlogcsv.model';
import { DatePipe } from '@angular/common';
import { State } from '../../models/state.model';
import { StateOption } from '../../models/status-optionmulti.model';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { FeatureGrapgQlService } from '../../services/pts-api/agile/feature.service';
import { SprintGrapgQlService } from '../../services/pts-api/agile/sprint.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UserStoryGrapgQlService } from '../../services/pts-api/agile/user-story.service';
import { PrioService } from '../../services/prio.service';
import { Urgency } from '../../models/urgency.model';

declare let alasql;


interface CustomDragulaOptions<T = any> extends DragulaOptions<T> {
    moves?: (el: Element, container: Element, handle: Element) => boolean;
}


@Component({
    selector: 'app-root',
    templateUrl: './management-us-feature.component.html',
    styleUrls: ['../../../assets/font/ds-digib-webfont.css'
        , '../../../assets/css/lib/font-awesome/font-awesome.min.css'
        , '../../../assets/font/opensans-regular.css'
        , '../../../assets/css/lib/bootstrap/bootstrap.min.css'
        , '../../../assets/css/ds.css'
        , '../../../assets/font/daily-scrum.css'
        , '../../../assets/css/media-queries.css']
})
export class ManagementUsFeatureComponent implements OnInit, OnDestroy {


    featureSubject: number;
    editFeatureMode: boolean = false;
    private PRODUCT_ID: number;
    private selectedFeature: any;

    private USER_STORY_TYPE = 1017760;
    private Current_USER: number;
    features: any[] = [];
    myProduct: Product;
    products: Product[] = [];
    sprintOptions: Sprint[] = [];
    dropdownListProject: Product[] = [];
    usStateFilterOptions = [];
    usStateFilterDropdownSettings = {};
    usStateFilterSeletcted = [];
    featureFilterOptions = [];
    featureFilterSelected = [];
    featureFilterDropdownSettings = {};
    userStoryStrSearch: string = '';
    strSearchinput: string = '';
    sprintFilterSelected = null;
    projectNameSelected: string = '0';
    private csvList: any[] = [];
    displayInput: boolean = false;
    htmlText: string;
    usfeatureSubject: number;
    usId: number;
    private stateNameSelected: '0';
    private sprintId: number;
    private dropSubscription: any;
    loading: boolean;
    private dragSubscription: any;
    activate: boolean = true;
    listUrgency: Urgency[] = [];

    @Input() currentUser: any;
    currentUserId: number = +JSON.parse(sessionStorage.currentUser).id;
    nonAssignedUserStories: UserStory[] = [];

    destroy$ = new Subject();
    constructor(
        private stateService: StateService,
        private projectService: ProjectService,
        private dragulaService: DragulaService,
        private productService: ProductService,
        private featureGrapgQlService: FeatureGrapgQlService,
        private sprintGrapgQlService: SprintGrapgQlService,
        private userStoryService: UserStoryService,
        private userStoryGrapgQlService:UserStoryGrapgQlService,
        private route: ActivatedRoute,
        public toastr: ToastrService,
        private prioService:PrioService) {
        const bag: any = this.dragulaService.find('DRAGULA_FEATURES');
        if (bag !== undefined) { this.dragulaService.destroy('DRAGULA_FEATURES'); }
        const bag2: any = this.dragulaService.find('DRAGULA_USS');
        if (bag2 !== undefined) { this.dragulaService.destroy('DRAGULA_USS'); }
        const options: CustomDragulaOptions = {
            copySortSource: false,
            moves: function (el, container, handle) {
                return handle.className === 'user-storie-feature'
                    || handle.className === 'storie-text'
                    || handle.className === 'postit-progress'
                    || handle.className === 'part-top'
                    || handle.className === 'user-storie-global-feature'
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
                    || handle.className === 'postit-header'
                    || handle.className === 'postit-status'
                    || handle.className === 'postit-info'
                    || handle.className === 'add-comment'
                    || handle.className === 'user-resp-values-task'
                    || handle.className === 'postit-close-circle';
            }
        };
        dragulaService.createGroup('DRAGULA_FEATURES', options);
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
        this.getListOfFeatureByProduct();
        this.getListState();
        this.getUSByProductIdWithoutFeature();
        this.featureFilterDropdownSettings = {
            singleSelection: false,
            text: 'Features',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            classes: 'fontawesome',
            badgeShowLimit: 0
        };
        this.usStateFilterDropdownSettings = {
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
        this.usfeatureSubject = userStory.featureId;

    }

    hideDetail(): void {
        this.usId = null;
        this.sprintId = null;
        this.usfeatureSubject = null;

    }

    onSearchUserStory() {
        this.strSearchinput = this.userStoryStrSearch;
        //this.filterArgsState = this.selectedStateItems;
    }

    // get List of Feature by product
    private getListOfFeatureByProduct(): void {
        this.loading = true;
        this.featureGrapgQlService.getFeaturesByProductId(this.PRODUCT_ID)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                const features = result.data.getFeaturesByProductId.items;
                if (!features?.length) {
                    this.loading = false;
                }
                features.forEach((data, index) => {
                    const feature = new Feature();
                    feature.id = data.id;
                    feature.name = data.name;
                    feature.text = data.name;
                    feature.order = data.displayOrder;
                    feature.id = data.id;
                    feature.chat_url = data.chat_url;
                    feature.project = data.project;


                    this.features.push(feature);
                    if (index === features.length - 1) {
                        this.loading = false;
                    }
                    if (feature.id) {
                        this.userStoryGrapgQlService.getUserStoriesByFeatureId(feature.id)
                            .subscribe((dataSource) => {
                                // push next userStory
                                const userStories = dataSource.data.getUserStoriesByFeatureId.items;
                                if (userStories.length !== 0) {
                                    for (const tsItem of this.features) {
                                        for (const usItem of userStories) {
                                            if (usItem.feature.id == tsItem.id) {
                                                const userStory = new UserStory();
                                                const cellCsv = new BackLogCsv();


                                                cellCsv['Feature id'] = tsItem.id;
                                                cellCsv['Feature name'] = tsItem.text;

                                                if (usItem.id !== undefined) {
                                                    userStory.id = usItem.id;
                                                    cellCsv['US id'] = usItem.id;
                                                }

                                                if (usItem.shortDescription !== undefined) {
                                                    userStory.shortDescription = usItem.shortDescription;
                                                    cellCsv['US short description'] = usItem.shortDescription;
                                                }

                                                if (usItem.feature !== undefined) {
                                                    userStory.feature = usItem.feature;
                                                }

                                                if (usItem.userCode !== undefined) {
                                                    userStory.userCode = usItem.userCode;
                                                    cellCsv['Responsible'] = usItem.userCode;
                                                }

                                                if (usItem.stateId !== undefined) {
                                                    userStory.state =  this.usStateFilterOptions.find(state => state.id == usItem.stateId)?.itemName;
                                                    cellCsv['State'] = usItem.stateId;
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
                                                    cellCsv['Order in Feature'] = usItem.orderByTopic;
                                                }


                                                if (usItem.sprint !== undefined) {
                                                    userStory.sprint = usItem.sprint;
                                                }

                                                if (usItem.sprint !== undefined) {
                                                    userStory.sprint  = usItem?.sprint ;
                                                    cellCsv['Sprint name'] = usItem?.sprint?.name ;
                                                }



                                                if (usItem.project !== undefined) {
                                                    userStory.project = usItem.project;
                                                    cellCsv['Project'] = usItem.project;
                                                }
                                                userStory.topic= usItem.topic;
                                                userStory.sprint = usItem.sprint;
                                                userStory.chat_url = usItem.chat_url;
                                                userStory.assignedTasketsNumber = usItem.assigned_tickets_number;
                                                userStory.ticketId = usItem.ticketId;
                                               
                                                tsItem.userStories.push(userStory);
                                                this.csvList.push(cellCsv);
                                            }
                                        }
                                    }
                                }
                                if (index === features.length - 1) {
                                    this.loading = false;
                                }
                            },
                                (err) => {
                                    console.log('Something went wrong!', err);
                                    if (index === features.length - 1) {
                                        this.loading = false;
                                    }
                                });
                    }
                });
                this.featureFilterOptions = this.features.map(item => ({
                    id: item.id,
                    itemName: item.text
                }));

            },
                (err) => {
                    console.log('Something went wrong!', err);
                    this.loading = false;
                }
            );
        this.loading = false;

    }

    // add new Feature
    addFeature(): void {
        const product = new Product();
        product.productId = this.myProduct.productId;
        product.productName = this.myProduct.productName;
        const feature = new Feature();
        feature.editMode = true;
        feature.product = product;
        this.features.unshift(feature);
    }

    private onDropModel(args: any): void {
        this.loading = true;
        let prevOrd: number = 0, nextOrd: number = 0, newOrder: number = 0;

        if (args.name === 'DRAGULA_USS') {
            const parentTicketId = args.target.dataset.featureid;
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
                featureId: parentTicketId || null,
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

        } else if (args.name === 'DRAGULA_FEATURES') {

            const featureSlectedId = args.el.dataset.featureid;
            const featureArray = args.targetModel;

            for (let i = 0; i < featureArray.length; i++) {

                if (featureArray[i].id == featureSlectedId) {

                    if (featureArray[i - 1] != undefined && featureArray[i - 1] != null) {
                        prevOrd = featureArray[i - 1].order;
                    }
                    if (featureArray[i + 1] != undefined && featureArray[i + 1] != null) {
                        nextOrd = featureArray[i + 1].order;
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

            const featureInputData = {
                displayOrder: newOrder.toFixed()
            };
            this.featureGrapgQlService.updateFeature(featureSlectedId, featureInputData)
                .pipe(
                    takeUntil(this.destroy$),
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((resultUpdateFeature) => {
                    const dataSource = resultUpdateFeature.data.updateFeature;
                    const selectedFeature = this.findFeatureById(this.features, featureSlectedId);
                    selectedFeature.order = dataSource.displayOrder;
                }
                );
        } else {
            this.loading = false;
            console.log('-- ERROR --!');
        }

    }

    private findFeatureById(listOffeature: Feature[], tsId: any): any {

        for (let item = 0; item < listOffeature.length; item++) {
            if (listOffeature[item].id == tsId) {
                return listOffeature[item];
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
                this.loadSprintOptions();
            });
    }

    private loadSprintOptions(): void {

        this.sprintGrapgQlService.getSprintsByProductId(this.PRODUCT_ID).subscribe(result => {

            this.sprintOptions = (result.data.getSprintsByProductId.items || []).map(item => ({
                id: item.id,
                name: item.name || item.id,
                sprintStartDate: item.startDate,
                ticketId: item.ticketId
            }));
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
                this.usStateFilterOptions = dataSource;
            });
    }

    getProjectName(selectedProjectName: any) {
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
            this.dragulaService.find('DRAGULA_USS').drake.cancel(true);
        }
    }

    private getUSByProductIdWithoutFeature(): void {
        this.loading = true;
        this.userStoryGrapgQlService.getUserStoriesByProductIdWithoutFeature(this.PRODUCT_ID)
         .subscribe(data=>{
             const nonAssignedUserStories = data.data.getUserStoriesByProductIdWithoutFeature.items;
             this.loading = false;
             this.nonAssignedUserStories = [];
             for (const response1 of nonAssignedUserStories) {
                 const nonAssignedUserStory = new UserStory();
                 nonAssignedUserStory.id = response1.id;
                 nonAssignedUserStory.state = this.usStateFilterOptions.find(state => state.id == response1.stateId)?.itemName;
                 nonAssignedUserStory.responsibleId = response1.responsibleId;
                 nonAssignedUserStory.shortDescription = response1.shortDescription;
                 nonAssignedUserStory.urgencyId = response1.urgencyId;
                 nonAssignedUserStory.urgencyIcon = this.listUrgency.find(urgency => urgency.urgencyId == response1.urgencyId)?.urgencyIcon;
                 nonAssignedUserStory.progress = response1.progress;
                 nonAssignedUserStory.storyPoints = +response1.storyPoints;
                 nonAssignedUserStory.project = response1.project;
                 //relation between userStory and feature not yet planned
                 nonAssignedUserStory.topic = response1.topic;
                 nonAssignedUserStory.springShortName = response1.ps_name;
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

    showFeatureDetail(feature: Feature): void {
        if (feature) {
            this.editFeatureMode = true;
            this.featureSubject = feature.id;
        } else {
            this.featureSubject = null;
            this.editFeatureMode = false;
        }
    }

    hideFeatureDetail(): void {
        this.featureSubject = null;
        this.editFeatureMode = false;
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
