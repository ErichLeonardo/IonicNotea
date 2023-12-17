import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiUrl = 'https://api-mi-tv.com'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) { }

  getChannels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/channels`);
  }

  getSchedule(channelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/channels/${channelId}/schedule`);
  }
}