import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${enviroment.apiUrl}/aviso`;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getNotificationById(notificationId: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${notificationId}`);
  }

  createNotification(notificationData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, notificationData);
  }

  updateNotification(
    notificationId: number,
    NotificationData: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${notificationId}`,
      NotificationData
    );
  }

  readNotification(notificationId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/lido/${notificationId}`, '');
  }

  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${notificationId}`);
  }
}
