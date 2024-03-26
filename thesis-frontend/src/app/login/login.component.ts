import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formData: FormGroup;

  constructor(
    private router: Router
  ) {
    this.formData = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {

  }

  public async back() {
    await this.router.navigate(["/.."]);
  }
}
