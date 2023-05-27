import { Component, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Feature } from '../../models/feature.model';
import { UserStory } from '../../models/user-story.model';
import { FeatureGrapgQlService } from '../../services/pts-api/agile/feature.service'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HelperService } from '../../shared/services/helper/helper.service';
@Component({
    selector: 'app-feature',
    templateUrl: './feature.component.html'
})
export class FeatureComponent implements OnDestroy {
    @Input() feature: Feature;
    // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-on-prefix
    @Output('onShowFeatureDetail') nofiy: EventEmitter<Feature> = new EventEmitter<Feature>();

    expanded: boolean = false;
    addCommentMode: boolean = false;
    commentsExpanded: boolean = false;
    destroy$ = new Subject();
    constructor(
        private featureGrapgQlService: FeatureGrapgQlService,
        private helper: HelperService
    ) { }


    ngOnDestroy(): void {
        this.destroy$.next(undefined);
        this.destroy$.complete();
    }

    toggleExpand(): void {
        this.expanded = !this.expanded;
    }

    saveFeature(feature: Feature): void {
        let new_Order, max_Order, old_Ord: any;
        if (feature.id == null) {

            this.featureGrapgQlService.getFeatureMaxOrder(feature.product.productId).subscribe(maxOrderData => {
                max_Order = maxOrderData.data.getFeatureMaxOrderByProduct.maxOrder;
                if (max_Order) {
                    new_Order = parseInt(max_Order, 10) + 100;
                } else {
                    new_Order = 100;
                }
                const featureInputData = {
                    productId: feature.product.productId,
                    name: feature._text,
                    displayOrder: new_Order,
                    stateId: 1037038
                };
                this.featureGrapgQlService.createFeature(featureInputData)
                    .pipe(
                        takeUntil(this.destroy$)
                    )
                    .subscribe((resultCreateFeature) => {
                        const dataSource = resultCreateFeature.data.createFeature
                        feature.editMode = false;
                        feature.id = dataSource.id;
                        feature.text = dataSource.name;
                        /*feature.chat_url = dataSource.data.chat_url;*/
                        feature.order = dataSource.displayOrder;
                    }
                    );
            });

        } else {
            old_Ord = feature.order;
            const featureInputData = {
                name: feature._text
            };
            this.featureGrapgQlService.updateFeature(feature.id, featureInputData)
                .pipe(
                    takeUntil(this.destroy$)
                )
                .subscribe((resultUpdateFeature) => {
                    const dataSource = resultUpdateFeature.data.updateFeature;
                    feature.text = dataSource.name;
                    feature.editMode = false;
                }
                );
        }
    }

    onClickId() {
        if (this.feature?.id) {
            this.nofiy.emit(this.feature);
        }
    }

    get appChatUrl(): string {
        return this.helper.getChatUrl(this.feature?.id, 'FEATURE');
    }
}
