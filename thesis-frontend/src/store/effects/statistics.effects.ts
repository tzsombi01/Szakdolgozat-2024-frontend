import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, concatMap, map } from "rxjs/operators";
import { of } from "rxjs";
import { getProgrammerStatisticsError, getProgrammerStatisticsRequest, getProgrammerStatisticsSuccess } from "../actions/statistics.actions";
import { StatisticsService } from "src/services/statistics.service";

@Injectable()
export class StatisticsEffects {
  constructor(
    private actions$: Actions,
    private statisticsService: StatisticsService
  ) { }

  getProgrammerStatistics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getProgrammerStatisticsRequest),
      concatMap(({ projectId, programmerStatisticsRequest }) => {
        return this.statisticsService.getProgrammerStatistics(projectId, programmerStatisticsRequest).pipe(
          map((data) => {
            return getProgrammerStatisticsSuccess({
              payload: {
                data,
                error: '',
                loading: false
              }
            });
          }),
          catchError((err) => {
            return of(getProgrammerStatisticsError({
              payload: {
                data: [],
                error: err,
                loading: false
              }
            }));
          })
        );
      })
    );
  });
}
