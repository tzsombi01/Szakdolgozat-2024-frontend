import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Comment } from 'src/models/comment';
import { CommentState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getCommentsWithTotal } from 'src/store/selectors/comment.selector';
import { getCommentsRequest } from 'src/store/actions/comment.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'] 
})
export class CommentComponent implements OnInit {

  comments$: Observable<Comment[] | any>;
  comments: Comment[] = [];
  comment?: Comment;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  constructor(
    public route: ActivatedRoute,
    private commentStore: Store<CommentState>
  ) {
    this.comments$ = this.commentStore.select(getCommentsWithTotal);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.comments$.pipe(untilDestroyed(this)).subscribe(({ comments, total }) => {
      this.comments = comments;
      console.log(comments);
      console.log(total);
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    this.commentStore.dispatch(getCommentsRequest({ queryOptions }));
  }

  isCommentsEmpty(): boolean {
    return this.comments.length === 0;
  }
}
