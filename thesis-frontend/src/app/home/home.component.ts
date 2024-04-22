import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserState } from 'src/store/app.states';
import { getToken } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token$: Observable<string | any>;
  token: string | undefined;

  constructor(
    private userStore: Store<UserState>
  ) {
    this.token$ = this.userStore.select(getToken);
  }

  ngOnInit(): void {
    this.token$.pipe(untilDestroyed(this)).subscribe((token) => {
      console.log(token)
      this.token = token;
    });
  }
}
