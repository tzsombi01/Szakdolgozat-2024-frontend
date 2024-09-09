import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs';
import { ProgrammerStatisticsRequest, ProgrammerStatisticsResponse, StatisticsType } from 'src/models/programmer-statistics';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { clearStatisticsState, getProgrammerStatisticsRequest } from 'src/store/actions/statistics.actions';
import { ProjectState, StatisticsState } from 'src/store/app.states';
import { getProgrammerStatistics, getStatisticsLoading } from 'src/store/selectors/statistics.selectos';

@UntilDestroy()
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit, OnDestroy {
  
  projectId?: string;

  programmerStatisticsResponses$: Observable<ProgrammerStatisticsResponse[] | any>;
  programmerStatisticsResponses: ProgrammerStatisticsResponse[] = [];

  statisticsLoading$: Observable<boolean>;

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    title: undefined,
    series: [
      {
        type: 'line',
        data: [1, 2, 3, 4, 5],
      },
    ],
  };

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
    private projectStore: Store<ProjectState>,
    private statisticsStore: Store<StatisticsState>,
  ) {
    this.programmerStatisticsResponses$ = this.statisticsStore.select(getProgrammerStatistics);

    this.statisticsLoading$ = this.statisticsStore.select(getStatisticsLoading);
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.projectId = params.get('id') ?? '';

      if (!this.projectId) {
        this.snackBar.open('No project ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(["/home"]);
      }

      this.projectStore.dispatch(getProjectRequest({ id: this.projectId }));

      this.onSiteOpen();
    });

    this.programmerStatisticsResponses$.pipe(untilDestroyed(this)).subscribe((programmerStatisticsResponses) => {
      this.programmerStatisticsResponses = programmerStatisticsResponses;
    });
  }

  ngOnDestroy(): void {
    this.statisticsStore.dispatch(clearStatisticsState());
  }

  onSiteOpen(): void {
    for (const value of Object.values(StatisticsType)) {
      const programmerStatisticsRequest: ProgrammerStatisticsRequest = {
        ids: [],
        type: value,
        from: undefined,
        until: undefined
      };
      this.statisticsStore.dispatch(getProgrammerStatisticsRequest({ projectId: this.projectId!, programmerStatisticsRequest }));
    }
  }
}
