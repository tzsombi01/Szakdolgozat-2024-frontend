import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import * as Highcharts from 'highcharts';
import { distinctUntilChanged, Observable } from 'rxjs';
import { ProgrammerStatisticsRequest, ProgrammerStatisticsResponse, StatisticsType } from 'src/models/programmer-statistics';
import { Project } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { User } from 'src/models/user';
import { getQueryOptions } from 'src/shared/common-functions';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { clearStatisticsState, getProgrammerStatisticsRequest } from 'src/store/actions/statistics.actions';
import { getUsersRequest } from 'src/store/actions/user.actions';
import { ProjectState, StatisticsState, UserState } from 'src/store/app.states';
import { getProject } from 'src/store/selectors/project.selector';
import { getProgrammerStatistics, getStatisticsLoading } from 'src/store/selectors/statistics.selectos';
import { getUserLoading, getUsers } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticComponent implements OnInit, AfterViewInit, OnDestroy {

  projectId?: string;

  programmerStatisticsResponses$: Observable<ProgrammerStatisticsResponse[] | any>;
  programmerStatisticsResponses: ProgrammerStatisticsResponse[] = [];

  users$: Observable<User[] | any>;
  users: User[] = [];
  usersLoading$: Observable<boolean | any>;

  statisticsLoading$: Observable<boolean>;

  Highcharts: typeof Highcharts = Highcharts;

  project$: Observable<Project | any>;
  project: Project | undefined;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  types: (StatisticsType[]) = Object.values(StatisticsType);

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
    private projectStore: Store<ProjectState>,
    private statisticsStore: Store<StatisticsState>,
    private userStore: Store<UserState>,
    private cdr: ChangeDetectorRef
  ) {
    this.programmerStatisticsResponses$ = this.statisticsStore.select(getProgrammerStatistics);
    this.project$ = this.projectStore.select(getProject);
    this.users$ = this.userStore.select(getUsers);

    this.statisticsLoading$ = this.statisticsStore.select(getStatisticsLoading);
    this.usersLoading$ = this.userStore.select(getUserLoading);
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

    this.programmerStatisticsResponses$
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      )
      .subscribe((programmerStatisticsResponses) => {
        this.programmerStatisticsResponses = programmerStatisticsResponses;
        console.log(programmerStatisticsResponses);
        this.cdr.markForCheck();
      });

    this.project$.pipe(untilDestroyed(this)).subscribe((project) => {
      this.project = project;

      if (this.project?.id) {
        const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);

        queryOptions.filters?.push({
          field: 'id',
          operator: 'contains',
          type: 'array',
          value: project.users
        });

        this.userStore.dispatch(getUsersRequest({ queryOptions }));

        // for (const value of this.types) {
        const programmerStatisticsRequest: ProgrammerStatisticsRequest = {
          ids: this.project?.users!,
          type: StatisticsType.COMMITS_PER_PROJECT,
          from: undefined,
          until: undefined
        };

        this.statisticsStore.dispatch(getProgrammerStatisticsRequest({ projectId: this.projectId!, programmerStatisticsRequest }));
        // }
      }
    });
  }

  ngAfterViewInit(): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.statisticsStore.dispatch(clearStatisticsState());
  }

  onSiteOpen(): void {

  }

  getChartData(type: StatisticsType | string): Highcharts.Options {
    return {
      chart: {
        type: this.getChartType(type)
      },
      title: {
        text: this.getChartTitle(type)
      },
      xAxis: {
        categories: this.getXAxisDataTypes(type), // Names on X-axis
        title: {
          text: this.getXAxisTitle(type)
        }
      },
      yAxis: {
        title: {
          text: this.getYAxisTitle(type)
        }
      },
      series: [
        {
          name: this.getBarTitle(type),
          type: this.getChartType(type),
          data: this.populateChart(type),
          showInLegend: false
        }
      ]
    };
  }

  private populateChart(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        return response.statisticsInfos.map(info => {
          return {
            y: info.numberOfCommits,
            color: '#00000'
          }
        });
        // return this.users.map(user => ({
        //   y: user.commits,
        //   color: user.color
        // }))
      }
      default: {
        return 'Statistic';
      }
    }
  }

  private getXAxisDataTypes(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        return response.statisticsInfos.map(info => info.name);
        // return this.users.map(user => user.userName);
      }
      default: {
        return this.users.map(user => user.userName);
      }
    }
  }

  private getChartType(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        return 'column';
      }
      default: {
        return 'column';
      }
    }
  }

  private getChartTitle(type: StatisticsType | string): string {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        return 'Commits per project';
      }
      default: {
        return 'Statistic';
      }
    }
  }

  private getBarTitle(type: StatisticsType | string): string {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        return 'Commits from user';
      }
      default: {
        return 'Statistic';
      }
    }
  }

  private getXAxisTitle(type: StatisticsType | string): string {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        return 'Users';
      }
      default: {
        return 'Statistic';
      }
    }
  }

  private getYAxisTitle(type: StatisticsType | string): string {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        return 'Number of commits';
      }
      default: {
        return 'Statistic';
      }
    }
  }
}
