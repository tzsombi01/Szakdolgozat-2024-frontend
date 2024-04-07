import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Documentation } from 'src/models/documentation';
import { DocumentationState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getDocumentationsWithTotal } from 'src/store/selectors/documentation.selector';
import { getDocumentationsRequest } from 'src/store/actions/documentation.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {

  documentations$: Observable<Documentation[] | any>;
  documentations: Documentation[] = [];
  documentation?: Documentation;
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
    private documentationStore: Store<DocumentationState>
  ) {
    this.documentations$ = this.documentationStore.select(getDocumentationsWithTotal);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.documentations$.pipe(untilDestroyed(this)).subscribe(({ documentations, total }) => {
      this.documentations = documentations;
      console.log(documentations)
      console.log(total)
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);

    this.documentationStore.dispatch(getDocumentationsRequest({ queryOptions }));
  }

  isDocumentationsEmpty(): boolean {
    return this.documentations.length === 0;
  }
}
