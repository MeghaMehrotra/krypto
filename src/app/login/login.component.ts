import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CONSTANTS } from '../utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any;
  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit() {
  }

  login(username, pass) {
    const body =  {username,
  password : pass};


    this.httpClient.post(CONSTANTS.SERVER_URL + `/signin`,
    body).subscribe((res: any) => {
console.log(res);
localStorage.setItem('user', res);
localStorage.setItem('username', res.username);
localStorage.setItem('id', res.id);
localStorage.setItem('accessToken', res.accessToken);

this.getManagerDetails(username);
this.router.navigate(['home']);
    },
    (err: HttpErrorResponse) => {

      alert(err.error.message);
      if (err.error instanceof Error) {
          console.log('Client-side error occured.');
      } else {
          console.log('Server-side error occured.');
      }
  });
  }

  getManagerDetails(username) {
    this.httpClient.
    get(CONSTANTS.SERVER_URL + `/manager/${username}`,
    {
      headers: new HttpHeaders().append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
    }).subscribe(
      (data: any) => {
          if (data.body.roles.name !== null) {
            localStorage.setItem('role', data.body.roles.name);
          }
          if (localStorage.getItem('role') === 'ADMIN') {
            this.router.navigateByUrl('/home');
          } else {
            this.router.navigateByUrl('/profile');
          }
      },
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
