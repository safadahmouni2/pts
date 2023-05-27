import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../models/comment.model';
@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {
    @Input() comment: Comment;
    @Input() expanded: boolean = false;
    @Input() titleClass: string = 'uc-title-us';
    @Input() bodyClass: string = 'uc-comment-us';
    constructor() { }

    ngOnInit() {
    }
    toggleExpanded(): void {
        this.expanded = !this.expanded;
    }
}
