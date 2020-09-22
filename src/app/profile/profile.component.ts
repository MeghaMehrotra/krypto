import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS } from '../utils/constants';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  firstName: string;
  user: any;

  constructor(private profileService: ProfileService,
              private httpClient: HttpClient,
              private router: Router
              ) { }

  ngOnInit() {
 this.getManagerDetails(localStorage.getItem('username'));
  }

  getManagerDetails(username) {
    this.httpClient.
    get(CONSTANTS.SERVER_URL + `/manager/${username}`,
    {
      headers: new HttpHeaders().append('Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
    }).subscribe(
      (data: any) => {
         this.user = data.body;
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
