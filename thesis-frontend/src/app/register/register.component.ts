import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserInput } from 'src/models/user';
import { registerRequest } from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [COMMA, ENTER] as const;
  gitHubUserNames: string[] = [];

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    userName: new UntypedFormControl(),
    password: new UntypedFormControl(),
    passwordAgain: new UntypedFormControl(),
    email: new UntypedFormControl('', Validators.email),
    firstName: new UntypedFormControl(),
    lastName: new UntypedFormControl(),
    someName: new UntypedFormControl(),
  });

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userStore: Store<UserState>
  ) {

  }

  close(): void {
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
      gitUserNames: this.gitHubUserNames
    };

    this.userStore.dispatch(registerRequest({ user }));

    this.formGroup.reset();
  }

  public async home() {
    await this.router.navigate(["/home"]);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.gitHubUserNames = [...this.gitHubUserNames, value];
    }

    event.chipInput!.clear();
  }

  remove(userEmailToRemove: string): void {
    const index = this.gitHubUserNames.indexOf(userEmailToRemove);

    this.gitHubUserNames.splice(index, 1);
  }

  edit(userEmail: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(userEmail);
      return;
    }

    const index = this.gitHubUserNames.indexOf(userEmail);

    if (index >= 0) {
      this.gitHubUserNames[index] = value;
    }
  }
}
