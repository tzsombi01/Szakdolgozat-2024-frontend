import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';
import { getLoggedInUserRequest, logOutRequest, setAccessTokenRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';
import { getLoggedInUser } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isAccessTokenDialogOpened: boolean = false;

  loggedInUser$: Observable<User | any>;
  loggedInUser: User | undefined;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    accessToken: new UntypedFormControl(),
  });

  constructor(
    private router: Router,
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

  open(type: ('accessToken')): void {
    if (type === 'accessToken') {
      this.isAccessTokenDialogOpened = true;
    }
  }

  close(type: ('cancel' | 'close' | 'submit')): void {
    if (type === 'close') {
      this.userStore.dispatch(setAccessTokenRequest({ accessToken: this.formGroup.controls['accessToken'].value }));
    }

    this.isAccessTokenDialogOpened = false;
    this.formGroup.reset();
  }

  logout(): void {
    this.userStore.dispatch(logOutRequest());

    this.router.navigate(['/login']);
  }

}
