import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { loginRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.email),
    password: new UntypedFormControl(),
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

    if (this.formGroup.invalid || !this.formGroup.controls['email'].value || !this.formGroup.controls['password'].value) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('One or more fields are invalid!', 'Close', {
        duration: 3000
      });
      return;
    }

    this.userStore.dispatch(loginRequest({ email: this.formGroup.controls['email'].value, password: this.formGroup.controls['password'].value }));

    this.formGroup.reset();
  }

  public async home() {
    await this.router.navigate(["/home"]);
  }
}
