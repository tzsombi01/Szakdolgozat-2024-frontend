import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { getLoggedInUserRequest, logOutRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';
import { getLoggedInUser } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  loggedInUser$: Observable<User | any>;
  loggedInUser: User | undefined;

  constructor(
    private router: Router,
    private userStore: Store<UserState>
  ) {
    this.loggedInUser$ = this.userStore.select(getLoggedInUser);
  }

  ngOnInit(): void {
    this.userStore.dispatch(getLoggedInUserRequest());

    this.loggedInUser$.pipe(untilDestroyed(this)).subscribe((user) => {  
      this.loggedInUser = user;
    });
  }

  logOut(): void {
    this.userStore.dispatch(logOutRequest());

    this.router.navigate(['/login']);
  }
}
