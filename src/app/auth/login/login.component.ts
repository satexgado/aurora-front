import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService, AuthenticationService, FormValidationService } from 'src/app/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  message = '';
  errMsgArr = [];

  constructor(private authService: AuthenticationService, 
    private router: Router, 
    private notificationService: NotificationService,
    private formValidationService: FormValidationService) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;  
    this.authService.login(this.loginForm.value).subscribe(() => {
      this.loading = false;
      this.router.navigateByUrl('home');
  }, err => {
    this.loading = false;
    if (err.status == 422) {
      this.errMsgArr = this.formValidationService.getErrors(err.errors);
    } else if(err.status == 401){
      this.notificationService.onWarning('Email ou mot de passe incorrect');
    } else {
      this.errMsgArr = [err.error.message];
    }
    console.log(err);
  });
  }

  createFormGroup() {
    return new FormGroup({
      username : new FormControl('',  [Validators.required]),
      password : new FormControl('',  [Validators.required, Validators.minLength(6)])
    });
  }
}
