import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getAllConnectedAgentList():Observable<any[]> {
    const path = environment.chatServerApi + "getAgentList";
    return this.http.get<any[]>(path);
  }
}
