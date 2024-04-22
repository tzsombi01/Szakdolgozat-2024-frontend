import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    userName: new UntypedFormControl(),
    password: new UntypedFormControl()
  });

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {

  }

  public async back() {
    await this.router.navigate(["/.."]);
  }
}
