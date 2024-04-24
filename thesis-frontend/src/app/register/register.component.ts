import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { State, Store } from '@ngrx/store';
import { UserInput } from 'src/models/user';
import { registerRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    userName: new UntypedFormControl(),
    password: new UntypedFormControl(),
    passwordAgain: new UntypedFormControl(),
    email: new UntypedFormControl('', Validators.email),
    firstName: new UntypedFormControl(),
    lastName: new UntypedFormControl(),
    gitUserNames: new UntypedFormControl(),
    someName: new UntypedFormControl(),
  });

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userStore: Store<UserState>
  ) {

  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.formGroup.controls['someName'].value) {
      return;
    }

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('One or more fields are invalid!', 'Close', {
        duration: 3000
      });
      return;
    }

    if ( this.formGroup.controls['password'].value !== this.formGroup.controls['passwordAgain'].value) {
      this.snackBar.open('Passwords do not match', 'Close', {
        duration: 3000
      });
    }

    const user: UserInput = {
      userName: this.formGroup.controls['userName'].value,
      password: this.formGroup.controls['password'].value,
      firstName: this.formGroup.controls['firstName'].value,
      lastName: this.formGroup.controls['lastName'].value,
      email: this.formGroup.controls['email'].value,
      gitUserNames: this.getGitUserNames()
    };

    this.userStore.dispatch(registerRequest({ user }));
  }

  private getGitUserNames(): string[] {
    return this.formGroup.controls['gitUserNames'].value.split(',') || [];
  }

  public async back() {
    await this.router.navigate(["/.."]);
  }
}
