import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CONSTANTS } from '../utils/constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  selectedRole: any = {};
  @ViewChild('ln', { static: true }) lastName: ElementRef;
  @ViewChild('fn', { static: true }) firstName: ElementRef;
  @ViewChild('confirmpass', { static: true }) confirmpass: ElementRef;
  roles: any = [];

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getRoles();
  }

  doSignUp(email, pass) {
    console.log(this.firstName.nativeElement.value);
    console.log(this.lastName.nativeElement.value);
    console.log(this.confirmpass.nativeElement.value);
    if (pass === this.confirmpass.nativeElement.value) {
      const manager = {
        roles: this.selectedRole,
        firstName : this.firstName.nativeElement.value,
        lastName : this.lastName.nativeElement.value,
        username: email,
        password: pass,
      };
      console.log(manager);
      this.httpClient
        .post(CONSTANTS.SERVER_URL + `/signup`, manager)
        .subscribe((res: any) => {
          if (res.status === true) {
            this.router.navigateByUrl('/login');
          } else {
            alert(res.responseMessage);
          }
        });
    } else {
      alert('Passwords do not match!!');
    }
  }

  getRoles() {
    this.httpClient.
      get(CONSTANTS.SERVER_URL + `/employee/roles`).subscribe(
        (data) => {
        this.roles = data;        },
        (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log('Client-side error occured.');
            } else {
                console.log('Server-side error occured.');
            }
        }
    );

  }
}
