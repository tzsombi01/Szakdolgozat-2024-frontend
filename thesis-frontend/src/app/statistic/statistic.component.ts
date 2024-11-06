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
import { getLoggedInUser, getUserLoading, getUsers } from 'src/store/selectors/user.selector';
import Heatmap from 'highcharts/modules/heatmap';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);
Heatmap(Highcharts);

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

  loggedInUser$: Observable<User | any>;
  loggedInUser: User | undefined;

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
    this.loggedInUser$ = this.userStore.select(getLoggedInUser);

    this.statisticsLoading$ = this.statisticsStore.select(getStatisticsLoading);
    this.usersLoading$ = this.userStore.select(getUserLoading);
  }

  ngOnInit(): void {
    this.snackBar.open('The statistics might take a while to load', 'Close', {
      duration: 3000
    });

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
        const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

        queryOptions.filters?.push({
          field: 'id',
          operator: 'contains',
          type: 'array',
          value: project.users
        });

        this.userStore.dispatch(getUsersRequest({ queryOptions }));

        for (const type of this.types) {
          let programmerStatisticsRequest: ProgrammerStatisticsRequest = {
            ids: this.getUserIds(type),
            type: type,
            from: this.getFrom(type),
            until: undefined
          };

          this.statisticsStore.dispatch(getProgrammerStatisticsRequest({ projectId: this.projectId!, programmerStatisticsRequest }));
        }
      }
    });

    this.loggedInUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.loggedInUser = user;

      if (Object.keys(user).length > 0) {
        if (this.loggedInUser?.accessToken) {
          this.snackBar.open('Without being authenticated, you can only see the commits by users and daily commits in the last year!', 'Close', {
            duration: 3000
          });
        }
      }
    });
  }

  getUserIds(type: StatisticsType | string): string[] {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return [this.project?.users[0]!];
      }
      default: {
        return this.project?.users!;
      }
    }
  }

  getFrom(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        return startDate.getTime();
      }
      default: {
        return undefined;
      }
    }
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
        type: this.getChartType(type),
        plotBorderWidth: this.getPlotBorderWidth(type)
      },
      title: {
        text: this.getChartTitle(type)
      },
      subtitle: {
        text: this.getSubtitle(type)
      },
      xAxis: {
        categories: this.getXAxisDataTypes(type),
        title: {
          text: this.getXAxisTitle(type)
        },
        opposite: this.getOpposite(type),
        lineWidth: this.getLineWidth(type),
        labels: {
          style: {
            fontWeight: 'bold'
          }
        }
      },
      yAxis: {
        title: {
          text: this.getYAxisTitle(type)
        },
        visible: this.isVisible(type)
      },
      series: [
        {
          name: this.getBarTitle(type),
          type: this.getChartType(type),
          data: this.populateChart(type),
          dataLabels: this.getDataLabel(type),
          showInLegend: false
        }
      ],
      colorAxis: this.getColorAxis(type),
      tooltip: this.getTooltip(type),
      legend: this.getLegend(type)
    };
  }

  private populateChart(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.COMMITS_PER_PROJECT: {
        const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        return response.statisticsInfos.map(info => {
          return {
            y: info.numberOfCommits,
            color: 'blue'
          }
        });
      }
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
        const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        return response.statisticsInfos.map(info => {
          return {
            y: info.averageSize,
            color: 'blue'
          }
        });
      }
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        let infos: any = response.statisticsInfos[0];
        return infos.map((info: any) => {
          return {
            x: info.x,
            y: info.y,
            value: info.value,
            date: info
          }
        });
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
      }
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
        const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        return response.statisticsInfos.map(info => info.name);
      }
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        // const response: ProgrammerStatisticsResponse = this.programmerStatisticsResponses.find(response => response.type === type)!;

        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
        return 'column';
      }
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return 'heatmap';
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
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
        return 'Average commit size';
      }
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return 'Commit Activity Heatmap (Yearly)';
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
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
        return 'Average commit size from user';
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
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
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
      case StatisticsType.AVERAGE_COMMIT_SIZE: {
        return 'Average commit size';
      }
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return '';
      }
      default: {
        return 'Statistic';
      }
    }
  }

  private getPlotBorderWidth(type: StatisticsType | string): number {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return 1;
      }
      default: {
        return 0;
      }
    }
  }

  private getLineWidth(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return 1;
      }
      default: {
        return undefined;
      }
    }
  }

  private getOpposite(type: StatisticsType | string): boolean {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return true;
      }
      default: {
        return false;
      }
    }
  }

  private isVisible(type: StatisticsType | string): boolean {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return false;
      }
      default: {
        return true;
      }
    }
  }

  private getColorAxis(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return {
          min: 0,
          max: 10,
          stops: [
            [0, '#dceeff'],
            [0.3, '#7cb5ec'],
            [1, '#1f4e99']
          ],
          labels: {
            format: '{value} commits'
          }
        };
      }
      default: {
        return undefined;
      }
    }
  }

  private getTooltip(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return {
          headerFormat: '',
          pointFormatter: function () {
            const formattedDate = Highcharts.dateFormat('%A, %b %e, %Y', this.date.date);
            return `${formattedDate}: <b>${this.value}</b> commits`;
          }
        };
      }
      default: {
        return {};
      }
    }
  }

  private getLegend(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return {
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle'
        };
      }
      default: {
        return {};
      }
    }
  }

  private getDataLabel(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return {
          enabled: true
        };
      }
      default: {
        return {};
      }
    }
  }

  private getSubtitle(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        return 'Daily commit activity over the past year';
      }
      default: {
        return '';
      }
    }
  }

  doWeHaveDataForType(type: StatisticsType | string): boolean {
    return !!this.programmerStatisticsResponses.find(response => response.type === type);
  }

  getChartStyles(type: StatisticsType | string): any {
    switch (type) {
      case StatisticsType.DAILY_COMMITS_FOR_YEAR: {
        console.log()
        return { 'width': '100%', 'height': '50rem', 'display': 'block' };
      }
      default: {
        return {};
      }
    }
  }
}
