import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { getLoggedInUserRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';
import { getLoggedInUser } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loggedInUser$: Observable<User | any>;
  loggedInUser: User | undefined;

  constructor(
    private userStore: Store<UserState>
  ) {
    this.loggedInUser$ = this.userStore.select(getLoggedInUser);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.userStore.dispatch(getLoggedInUserRequest());

    this.loggedInUser$.pipe(untilDestroyed(this)).subscribe((user) => {
      console.log(user);
      this.loggedInUser = user;
    });
  }

  onSiteOpen(): void {
    
  }

  logout(): void {
    
  }

}
