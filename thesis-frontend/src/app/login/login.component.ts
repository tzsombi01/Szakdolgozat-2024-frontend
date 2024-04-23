import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loginRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';
import { getToken } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  token$: Observable<string | any>;
  token: string | undefined;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email),
    password: new UntypedFormControl()
  });

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userStore: Store<UserState>
  ) {
    this.token$ = this.userStore.select(getToken);
  }

  ngOnInit(): void {
    this.token$.pipe(untilDestroyed(this)).subscribe((token) => {
      this.token = token;
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid || !this.formGroup.controls['email'].value || !this.formGroup.controls['password'].value) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('One or more fields are invalid!', 'Close', {
        duration: 3000
      });
      return;
    }

    this.userStore.dispatch(loginRequest({ email: this.formGroup.controls['email'].value, password: this.formGroup.controls['password'].value }));
  }

  public async back() {
    await this.router.navigate(["/.."]);
  }
}
