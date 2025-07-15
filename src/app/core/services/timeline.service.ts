import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { Timeline } from '../interfaces/timeline';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private apiUrl = `${enviroment.apiUrl}/cronograma`;

  constructor(private http: HttpClient) {}

  getTimelines(): Observable<Timeline[]> {
    return this.http.get<Timeline[]>(this.apiUrl);
  }

  getTimelineById(timelineId: number): Observable<Timeline> {
    return this.http.get<Timeline>(`${this.apiUrl}/${timelineId}`);
  }

  createTimeline(timelineData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, timelineData);
  }

  updateTimeline(timelineId: number, TimelineData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${timelineId}`, TimelineData);
  }

  deleteTimeline(timelineId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${timelineId}`);
  }
}
