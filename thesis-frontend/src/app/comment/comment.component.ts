import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Comment, CommentInput, CommentType } from 'src/models/comment';
import { CommentState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getCommentLoading, getCommentsWithTotal } from 'src/store/selectors/comment.selector';
import { createCommentRequest, editCommentRequest, getCommentsRequest } from 'src/store/actions/comment.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/models/ticket';
import { Discussion } from 'src/models/discussion';
import { Documentation } from 'src/models/documentation';
import { marked } from 'marked';
import { User } from 'src/models/user';

@UntilDestroy()
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  parentEntity?: Ticket | Discussion | Documentation;

  @Input()
  type: CommentType | string = CommentType.Ticket;

  @Input()
  loggedInUser?: User;

  comments$: Observable<Comment[] | any>;
  comments: Comment[] = [];
  commentsLoading$: Observable<boolean | any>;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  newCommentDescription: string = '';
  parsedNewComment: string = '';
  editingComments: string[] = [];
  showPreview: boolean = false;
  editingCommentDescription: string = '';

  constructor(
    public route: ActivatedRoute,
    private commentsStore: Store<CommentState>,
  ) {
    this.comments$ = this.commentsStore.select(getCommentsWithTotal);

    this.commentsLoading$ = this.commentsStore.select(getCommentLoading);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.comments$.pipe(untilDestroyed(this)).subscribe(({ comments, total }) => {
      this.comments = comments;
      console.log(comments)
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    queryOptions.filters?.push({
      field: 'reference',
      operator: 'eq',
      type: 'string',
      value: this.parentEntity?.id
    });

    this.commentsStore.dispatch(getCommentsRequest({ queryOptions }));
  }

  editComment(id: string) {
    this.editingComments.push(id);
    const comment: Comment = this.comments.find(comment => comment.id === id)!;
    this.editingCommentDescription = comment.description!;
  }

  cancelEdit(id: string) {
    this.editingComments = this.editingComments.filter((editingComment: string) => editingComment !== id);
    this.editingCommentDescription = '';
  }

  parseMarkdown(content: string): any {
    const result = marked.parse(content || '');

    if (typeof result === 'string') {
      return result;
    } else if (result instanceof Promise) {
      result.then(res => {
        return res;
      });
    }
  }

  togglePreview() {
    this.showPreview = !this.showPreview;

    if (this.showPreview) {
      this.previewComment();
    }
  }

  previewComment() {
    const result = marked.parse(this.newCommentDescription || '');

    if (typeof result === 'string') {
      this.parsedNewComment = result;
    } else if (result instanceof Promise) {
      result.then(res => {
        this.parsedNewComment = res;
      });
    }
  }

  saveComment(type: ('new' | 'edit'), id?: string) {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    if (type === 'new') {
      const newComment: CommentInput = {
        description: this.newCommentDescription,
        creator: this.loggedInUser?.id!,
        reference: this.parentEntity?.id!,
        commentType: this.type as CommentType,
        edited: false
      };

      this.commentsStore.dispatch(createCommentRequest({ comment: newComment, queryOptions }));
    } else if (type === 'edit') {
      const editedComment: CommentInput = {
        description: this.editingCommentDescription,
        creator: this.loggedInUser?.id!,
        reference: this.parentEntity?.id!,
        commentType: this.type as CommentType,
        edited: true
      };
      console.log(editedComment)
      this.commentsStore.dispatch(editCommentRequest({ id: id!, comment: editedComment, queryOptions }));
    }

    this.newCommentDescription = '';
    this.parsedNewComment = '';
    this.showPreview = false;
  }
}
