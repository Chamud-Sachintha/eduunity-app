import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  loadHomeData(userId: any) {
    const path = environment.apiUrl + "home/index" + "?userId=" + userId;
    return this.http.get(path);
  }
}
