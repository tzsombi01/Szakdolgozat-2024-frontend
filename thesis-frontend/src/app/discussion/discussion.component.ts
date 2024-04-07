import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Discussion } from 'src/models/discussion';
import { DiscussionState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getDiscussionsWithTotal } from 'src/store/selectors/discussion.selector';
import { getDiscussionsRequest } from 'src/store/actions/discussion.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {

  discussions$: Observable<Discussion[] | any>;
  discussions: Discussion[] = [];
  discussion?: Discussion;
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
    private discussionStore: Store<DiscussionState>
  ) {
    this.discussions$ = this.discussionStore.select(getDiscussionsWithTotal);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.discussions$.pipe(untilDestroyed(this)).subscribe(({ discussions, total }) => {
      this.discussions = discussions;
      console.log(discussions)
      console.log(total)
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);

    this.discussionStore.dispatch(getDiscussionsRequest({ queryOptions }));
  }

  isDiscussionsEmpty(): boolean {
    return this.discussions.length === 0;
  }
}
