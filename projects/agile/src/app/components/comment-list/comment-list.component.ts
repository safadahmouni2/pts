import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html'
})
export class CommentListComponent implements OnInit {
    @Input() objectId: number;
    @Input() expanded: boolean = false;
    @Output() expandedChange = new EventEmitter<boolean>();
    @Input() addCommentMode: boolean = false;
    @Output() addCommentModeChange = new EventEmitter<boolean>();
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('ischanged') isChanged: number;
    comments: Comment[] = [];
    commentText: string;
    constructor(private commentService: CommentService) { }

    ngOnInit() {
    }

    toggleExpanded(): void {
        if (this.expanded === false) {
            this.getComments();
        }
        this.expanded = !this.expanded;
        this.expandedChange.emit(this.expanded);
    }

    toggleAddCommentMode(): void {
        this.commentText = '';
        this.addCommentMode = !this.addCommentMode;
        this.addCommentModeChange.emit(this.addCommentMode);
    }
    addComment(comment: string): void {
        if(this.objectId) {
            this.commentService.addComment(comment, this.objectId).subscribe(dataSource => {
                this.toggleAddCommentMode();
                this.getComments();
            });
       }

    }
    getComments(): void {
        if(this.objectId) {

            this.commentService.getComments(this.objectId).subscribe(comments => {
                console.log(" this.objectId", this.objectId);
                console.log("get comments", comments);
                this.comments = [];
                for (const data of comments) {
                    const comment = new Comment();
                    comment.text = data.text;
                    comment.authorCode = data.authorCode;
                    comment.creationDate = data.creationDate;

                    this.comments.push(comment);
                }

            });
        }
    }
}
