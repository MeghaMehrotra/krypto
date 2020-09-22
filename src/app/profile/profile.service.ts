import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) {}

  updateProfile(userProfile: any) {
    this.httpClient.put(CONSTANTS.SERVER_URL + '/profile', userProfile);
  }
}
