import { Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { Notification } from "src/models/notification";
import { QueryOptions } from 'src/models/query-options';
import { User } from 'src/models/user';
import { getQueryOptions } from 'src/shared/common-functions';
import { getNotificationsRequest } from 'src/store/actions/notification.actions';
import { NotificationState } from 'src/store/app.states';
import { getNotificationLoading, getNotificationsWithTotal } from 'src/store/selectors/notification.selector';

@UntilDestroy()
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  @Input()
  loggedInUser!: User;

  isDialogOpen: boolean = false;
  isDetailDialogOpen: boolean = false;
  
  notifications$: Observable<Notification[] | any>;
  notifications: Notification[] = [];
  notification?: Notification;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  notificationsLoading$: Observable<boolean | any>;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(),
    message: new UntypedFormControl()
  });

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private notificationStore: Store<NotificationState>
  ) {
    this.notifications$ = this.notificationStore.select(getNotificationsWithTotal);

    this.notificationsLoading$ = this.notificationStore.select(getNotificationLoading);
  }

  ngOnInit(): void {
    this.notifications$.pipe(untilDestroyed(this)).subscribe(({ notifications, total }) => {
      this.notifications = notifications;
    });
  }

  close(type: ('close' | 'submit' | 'delete')): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    if (type === 'close') {
      this.isDialogOpen = false;
    }

    this.formGroup.reset();
    this.isDialogOpen = false;
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    queryOptions.filters?.push({
      field: 'target',
      operator: 'eq',
      type: 'string',
      value: this.loggedInUser.id
    });

    this.notificationStore.dispatch(getNotificationsRequest({ queryOptions }));
  }

  handleClick(): void {
    this.isDialogOpen = true;
  }
}
